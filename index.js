'use strict'
let { Perceptor, Database } = require('./Perceptors/back');
global.fs = require('fs');

let metadata = {
    styles: [
        './css/root.css',
        './css/header.css',
        './css/main.css',
        './css/sidebar.css',
        './css/random.css',
        './css/dashboard.css',
        './css/users.css',
        './css/apps.css',
        './css/notifications.css',
        './fontawesome/css/all.css'
    ],
    scripts: {
        './includes/index.js': { type: 'module' },
    }
};

global.perceptor = new Perceptor({ server: { address: "mongodb://localhost:27017/", name: 'craterapi' } });
global.db = new Database({ address: "mongodb://localhost:27017/", name: 'craterapi' });
global.bcrypt = require('bcrypt');
global.ObjectId = require('mongodb').ObjectId;

let { PostHandler } = require('./includes/classes/PostHandler');
let { Extra } = require('./includes/classes/Extra');
let { View } = require('./includes/classes/View');

let postHandler = new PostHandler();
let extra = new Extra();
let view = new View(metadata, 'webapp');

let {port, protocol} = perceptor.getCommands('-');

perceptor.createServer(port || 8082,
    params => {
        view.createView(params);
    }, protocol || 'https',
    { origins: ['*'] },
    {
        key: fs.readFileSync('./permissions/server.key'),
        cert: fs.readFileSync('./permissions/server.crt')
    }
);

perceptor.recordSession(24 * 60 * 60 * 1000);
perceptor.handleRequests = (req, res, form) => {
    postHandler.act(req, res, form);
}

extra.clearEmptyApps();