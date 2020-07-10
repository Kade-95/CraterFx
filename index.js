'use strict'
let { Perceptor, Database } = require('./Perceptors/back');
global.fs = require('fs');

let metadata = {
    styles: [
    ],
    scripts: {
    }
};

global.perceptor = new Perceptor({ server: { address: "mongodb://localhost:27017/", name: 'craterapi' } });
global.db = new Database({ address: "mongodb://localhost:27017/", name: 'craterapi' });
global.bcrypt = require('bcrypt');
global.ObjectId = require('mongodb').ObjectId;

let { PostHandler } = require('./includes/classes/PostHandler');

let postHandler = new PostHandler();

perceptor.createServer(8080,
    params => {
        params.response.end('Crater API');
    }, 'https',
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