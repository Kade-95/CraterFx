const { ObjectId } = require("mongodb");

class Extra {

    constructor() {
        this.removedApps = [];
        this.siteApps = {};
    }

    clearEmptyApps() {
        return new Promise((resolve, reject)=>{
            this.removeEmptyApps();

            setInterval(() => {
                this.removeEmptyApps();
            }, perceptor.secondsInDays(1) * 1000);
        });
    }

    removeEmptyApps() {
        let count = 0//init delete counter
        this.siteApps = {};//used to store all apps
        let appDetails = {};//each app container
        db.find({ collection: 'apps', query: {}, many: true, projection: { id: 1, page: 1, lastFetched: 1 } })
            .then(apps => {
                for (let app of apps) {
                    if (!perceptor.isset(this.siteApps[app.page])) {//init site
                        this.siteApps[app.page] = [];
                    }
                    appDetails = { _id: app._id };
                    if (perceptor.isset(app.lastFetched)) {//check fetched app and set day for app and site
                        appDetails.dayFetched = perceptor.dateValue(perceptor.date(app.lastFetched));
                        if (!perceptor.isset(this.siteApps[app.page].dayFetched) || appDetails.dayFetched > this.siteApps[app.page].dayFetched) {
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
                    if (perceptor.isset(this.siteApps[site].dayFetched)) {//get sites with fetched date
                        for (let app of this.siteApps[site]) {
                            if (!perceptor.isset(app.dayFetched) || this.siteApps[site].dayFetched > app.dayFetched) {//remove all deleted appss
                                db.delete({ collection: 'apps', query: { _id: new ObjectId(app._id) } });
                                count++;
                            }
                        }
                    }
                }
                console.log(`Removed ${count} unused apps`);
            })
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
}

module.exports = { Extra };