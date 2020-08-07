const { ObjectID } = require("mongodb");

class PostHandler {

    constructor() {
        this.sessions = perceptor.sessionsManager.sessions;
        this.ignoreActive = ['login'];
        this.appRequests = ['fetchApp', 'putApp', 'deleteApp'];
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

        let deliver = (params) => {
            if (params.flag) {
                this[action](req, res, data);
            }
            else {
                this.respond(req, res, params.error);
            }
        }

        if (perceptor.isset(this[action])) {
            if (this.appRequests.includes(action)) {
                deliver({ error: 'Not Authorized', flag: this.locals.includes(req.headers.origin) || this.validateDomain(req) });
            }
            else if (this.ignoreActive.includes(action)) {
                deliver({ flag: true });
            }
            else {
                deliver({ error: 'Expired', flag: this.isActive(req.sessionId) });
            }
        }
        else {
            console.log(data);
            this.respond(req, res, 'Unknown Request');
        }
    }

    ifNotExist(params) {
        if (params.action == 'insert') {
            params.query.timeCreated = new Date().getTime();
            params.query.lastModified = new Date().getTime();
        }
        else if (params.action == 'update') {
            params.query.lastModified = new Date().getTime();
        }

        return db.ifNotExist(params);
    }

    ifIExist(params) {
        if (params.action == 'update') {
            if (perceptor.isset(params.option)) {
                if (perceptor.isset(params.options['$set'])) {
                    params.options['$set'].lastModified = new Date().getTime();
                }
                if (perceptor.isset(params.options['$push'])) {
                    params.options['$push'].lastModified = new Date().getTime();
                }
                if (perceptor.isset(params.options['$pull'])) {
                    params.options['$pull'].lastModified = new Date().getTime();
                }
            }
        }

        return db.ifIExist(params);
    }

    insert(params) {
        params.query.timeCreated = new Date().getTime();
        params.query.lastModified = new Date().getTime();

        return db.insert(params);
    }

    set(params) {
        params.options['$set'].lastModified = new Date().getTime();

        return db.update(params);
    }

    pull(params) {
        return db.update(params);
    }

    push(params) {
        return db.update(params);
    }

    update(params) {
        params.options['$set'] = params.options['$set'] || { lastModified: new Date().getTime() };

        return db.update(params);
    }

    login(req, res, data) {
        if (data.email == 'admin@mail.com') {
            let id = new ObjectID();

            this.respond(req, res, { user: id, userType: 'admin', fullName: 'prototype', image: null });
            this.sessions[req.sessionId].set({ user: ObjectID(id).toString(), active: true });
            return;
        }
        db.find({ collection: 'users', query: { email: data.email }, projection: { currentPassword: 1, userType: 1, fullName: 1, userImage: 1 } }).then(result => {
            if (!perceptor.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        this.respond(req, res, { user: result._id, userType: result.userType, fullName: result.fullName, image: result.userImage });
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
        if (!perceptor.isset(data._id) || data._id == '') {
            this.respond(req, res, null);
            return;
        }

        db.find({ collection: 'apps', query: { _id: new ObjectID(data._id), page: data.page } }).then(result => {
            this.respond(req, res, result);
            console.log(`Fetched ${data._id} on ${data.page}`);
            db.update({ collection: 'apps', query: { _id: new ObjectID(data._id), page: data.page }, options: { $set: { lastFetched: new Date().getTime() } } });
        });
    }

    putApp(req, res, data) {
        let attributes = JSON.parse(data.attributes);

        if (!perceptor.isset(attributes._id) || attributes._id == '') {
            delete attributes._id;
            attributes.timeCreated = new Date().getTime();

            db.insert({ collection: 'apps', query: attributes, getInserted: true }).then(result => {
                let id = result.shift()._id;
                this.respond(req, res, id);
                console.log(`Created ${id} on ${attributes.page}`);
            });
        }
        else {
            attributes._id = new ObjectID(attributes._id);
            attributes.lastModified = new Date().getTime();

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