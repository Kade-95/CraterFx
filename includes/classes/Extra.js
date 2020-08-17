const { ObjectId } = require("mongodb");
const { Database } = require("kerds");

class Extra {

    constructor() {
        this.removedApps = [];
        this.siteApps = {};
    }

    clearEmptyApps() {
        return new Promise((resolve, reject) => {
            this.removeEmptyApps();
            setInterval(() => {
                this.removeEmptyApps();
            }, kerds.secondsInDays(1) * 1000);
        });
    }

    removeEmptyApps() {
        let count = 0//init delete counter
        this.siteApps = {};//used to store all apps
        let appDetails = {};//each app container
        db.find({ collection: 'apps', query: {}, many: true, projection: { id: 1, page: 1, lastFetched: 1 } })
            .then(apps => {
                for (let app of apps) {
                    if (!kerds.isset(this.siteApps[app.page])) {//init site
                        this.siteApps[app.page] = [];
                    }
                    appDetails = { _id: app._id };
                    if (kerds.isset(app.lastFetched)) {//check fetched app and set day for app and site
                        appDetails.dayFetched = kerds.dateValue(kerds.date(app.lastFetched));
                        if (!kerds.isset(this.siteApps[app.page].dayFetched) || appDetails.dayFetched > this.siteApps[app.page].dayFetched) {
                            this.siteApps[app.page].dayFetched = appDetails.dayFetched;
                        }
                    }
                    this.siteApps[app.page].push(appDetails);
                    if (app.id == '') {//delete apps with unset id
                        db.delete({ collection: 'apps', query: { _id: new ObjectId(app._id) } });
                        count++;
                    }
                }

            })
            .then(() => {
                for (let site in this.siteApps) {
                    if (kerds.isset(this.siteApps[site].dayFetched)) {//get sites with fetched date
                        for (let app of this.siteApps[site]) {
                            if (!kerds.isset(app.dayFetched) || this.siteApps[site].dayFetched > app.dayFetched) {//remove all deleted appss
                                db.delete({ collection: 'apps', query: { _id: new ObjectId(app._id) } });
                                count++;
                            }
                        }
                    }
                }
                console.log(`Removed ${count} unused apps`);
                return true;
            });
    }

    getSiteApps(site) {
        return db.find({ collection: 'apps', query: {}, many: true, projection: { id: 1 } })
            .then(apps => {
                let myApps = [];

                for (let app of apps) {
                    if (app.id == '') {
                        myApps.push(app)
                    }
                }

                return myApps;
            });
    }

    automateBackup(){
        // console.log(time.getHours())
        setInterval(() => {
            let time = new Date();
            if(time.getDay() == 7 && time.getHours() == 23){
                this.backup();
            }
        }, kerds.secondsInHours(1) * 1000);
    }

    backup() {
        console.log('Backing up...');
        let backupFolder = './backups';
        let backupName = `${backupFolder}/${kerds.today()}`;
        let fileName;
        let collectionName, data = { tenantDBs: {} };

        let upload = (path, name, data) => {
            fs.exists(path, found => {
                if (!found) {
                    fs.mkdir(path, { recursive: true }, () => {
                        fs.writeFile(name, data, (written, err) => {
                            console.log(err, written);
                        });
                    });
                }
                else {
                    fs.writeFile(name, data, (err) => {
                        if (err) {
                            console.log(`Error backing up ${name} => ${err}`);
                        }
                    });
                }
            });
        }
        let run = {};
        db.getCollections().then(collections => {//get all collections in main databse
            for (let collection of collections) {
                collectionName = collection.name;
                run[collectionName] = db.find({ collection: collectionName, query: {}, many: true });//get all documents main database
            }

            kerds.runParallel(run, ran => {
                for (let name in ran) {
                    fileName = `${backupName}/${name}.txt`;
                    upload(backupName, fileName, JSON.stringify(ran[name]));//upload all documents in main databse

                    if (name == 'tenants') {
                        let runTenants = {};
                        for (let tenant of ran[name]) {
                            data.tenantDBs[tenant.name] = new Database({ address: "mongodb://localhost:27017/", name: tenant.name });//get collections in each tenant database

                            runTenants[tenant.name] = data.tenantDBs[tenant.name].getCollections();
                        }

                        kerds.runParallel(runTenants, tenantCollections => {
                            let runTenantsCollections = {};
                            for (let tenantName in tenantCollections) {
                                for (let collection of tenantCollections[tenantName]) {
                                    runTenantsCollections[JSON.stringify({ tenantName, collection: collection.name })] = data.tenantDBs[tenantName].find({ collection: collection.name, query: {}, many: true });//get all documents in each tenant database
                                }
                            }

                            kerds.runParallel(runTenantsCollections, ranTenantsCollections => {
                                for (let tenant in ranTenantsCollections) {
                                    let { tenantName, collection } = JSON.parse(tenant);
                                    let tenantBackupName = `${backupName}/CurrentTenants/${tenantName}`;
                                    let tenantFileName = `${tenantBackupName}/${collection}.txt`;
                                    upload(tenantBackupName, tenantFileName, JSON.stringify(ranTenantsCollections[tenant]));//upload all tenants documents
                                }
                                delete data.tenantDBs;
                                console.log('Backup Complete');
                            });
                        });
                    }
                }
            });
        });
    }

    pullBackup(date) {
        let path = `./backups/${date}`;
        let backup = this.getBackup(path);
        return backup;
    }

    getBackup(path) {
        let stats = fs.statSync(path);
        let parent;
        if (stats.isFile()) {
            let data = fs.readFileSync(path);
            parent = JSON.parse(data.toString());
            // console.log(parent);
        }
        else if (stats.isDirectory()) {
            let dir = fs.readdirSync(path);
            parent = {};
            for (let p of dir) {
                parent[p.slice(0, p.lastIndexOf('.'))] = this.getBackup(`${path}/${p}`);
            }
        }
        return parent;
    }
}

module.exports = { Extra };