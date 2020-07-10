const { ObjectID } = require("mongodb");

class PostHandler {

    constructor() {
        this.sessions = perceptor.sessionsManager.sessions;
        this.ignoreActive = ['login'];
        this.adminOnly = ['createUser', 'makeAdmin', 'makeStaff', 'deleteUser'];
        this.domains = [
            'sharepoint.com'
        ];
        this.locals = [
            'https://localhost:4321'
        ];
    }

    validateDomain(req) {
        let splitOrigin = req.headers.origin.split('.'),
            originLen = splitOrigin.length,
            splitDomain,
            domainLen,
            flag = false;

        for (let domain of this.domains) {
            splitDomain = domain.split('.');
            domainLen = splitDomain.length;
            flag = (splitOrigin[originLen - 1] == splitDomain[domainLen - 1] && splitOrigin[originLen - 2] == splitDomain[domainLen - 2]);
        }

        return flag;
    }

    act(req, res, data) {
        data = this.prepareData(data);
        let action = data.action;
        delete data.action;

        if (perceptor.isset(this[action])) {
            let flag = this.locals.includes(req.headers.origin) || this.validateDomain(req);

            console.log(flag);

            if (flag) {
                this[action](req, res, data);
            }
            else {
                this.respond(req, res, 'Not Authorized');
            }
        }
        else {
            this.respond(req, res, 'Unknown Request');
        }
    }

    login(req, res, data) {
        db.find({ collection: 'users', query: { email: data.email }, projection: { currentPassword: 1, userType: 1 } }).then(result => {
            if (!perceptor.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        this.respond(req, res, { user: result._id, userType: result.userType });
                        this.sessions[req.sessionId].set({ user: ObjectId(result._id).toString(), active: true });
                    }
                    else {
                        this.respond(req, res, 'Incorrect')
                    }
                });
            }
            else {
                this.respond(req, res, '404')
            }
        });
    }

    isActive(user) {
        return this.sessions[user].active;
    }

    isUserActive(req, res, data) {
        let active = false;
        for (let id in this.sessions) {
            if (this.sessions[id].user == data.user) {
                active = this.sessions[id].active;
                if (active) break;
            }
        }
        this.respond(req, res, active);
    }

    find(req, res, data) {
        let params = JSON.parse(data.params);
        params = this.organizeData(params);
        let action = params.action;
        delete params.action;

        let prepareResult = result => {
            let preparedResult;
            if (!perceptor.isnull(result)) {
                if (Array.isArray(result)) {
                    preparedResult = [];
                    for (let i in result) {
                        delete result[i].currentPassword;
                    }
                }
                else if (typeof result == 'object') {
                    delete result.currentPassword;
                }
            }
            preparedResult = result;

            return preparedResult
        }

        if (perceptor.isset(action)) {
            this.respond(req, res, 'actioned');
        }
        else {
            db.find(params).then(result => {
                this.respond(req, res, prepareResult(result));
            });
        }
    }

    organizeData(params) {
        if (perceptor.isset(params.query)) {
            if (perceptor.isset(params.changeQuery)) {
                for (var i in params.changeQuery) {
                    if (perceptor.isset(params.query[i])) {
                        if (params.changeQuery[i] == 'objectid') {
                            params.query[i] = new ObjectId(params.query[i]);
                        }
                    }
                }
            }
        }
        return params;
    }

    prepareData(data) {
        let preparedData = {};
        let value;
        for (let i in data) {
            if (!perceptor.isset(preparedData[i])) {

                if (data[i].filename != '') {
                    value = data[i];
                }
                else {
                    value = data[i].value.toString();
                    if (value == '[object Object]') {
                        value = data[i];
                    }
                }
                preparedData[i] = value;
            }
        }

        return preparedData;
    }

    respond(req, res, data) {
        res.end(JSON.stringify(data));
    }

    logout(req, res, data) {
        delete this.sessions[req.sessionId].user;
        this.sessions[req.sessionId].active = false;
        this.respond(req, res, true);
    }

    fetchApp(req, res, data) {
        console.log(data);

        if (!perceptor.isset(data._id) || data._id == '') {
            this.respond(req, res, null);
            return;
        }

        db.find({ collection: 'apps', query: { _id: new ObjectID(data._id), page: data.page } }).then(result => {
            this.respond(req, res, result);
            console.log(`Fetched data for ${JSON.stringify(data)}`);
        });
    }

    putApp(req, res, data) {
        let attributes = JSON.parse(data.attributes);

        if (!perceptor.isset(attributes._id) || attributes._id == '') {
            delete attributes._id;
            db.insert({ collection: 'apps', query: attributes, getInserted: true }).then(result => {
                let id = result.shift()._id;
                this.respond(req, res, id);
                console.log(`Created ${id} on ${attributes.page}`);
            });
        }
        else {
            attributes._id = new ObjectID(attributes._id);
            db.save({ collection: 'apps', query: attributes, check: { _id: attributes._id, page: attributes.page } }).then(result => {
                console.log(`Updated ${attributes._id} on ${attributes.page}`);
                this.respond(req, res, attributes._id);
            });
        }
    }

    deleteApp(req, res, data) {
        if (!perceptor.isset(data._id) || data._id == '') {
            this.respond(req, res, 'null');
            return;
        }

        db.delete({ collection: 'apps', query: { _id: new ObjectID(data._id) } }).then(result => {
            this.respond(req, res, result);
            console.log(`Deleted ${data._id}`);
        });
    }
}

module.exports = { PostHandler };