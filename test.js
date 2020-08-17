let fs = require('fs');
let backup = {};
let path = 'backups/2020-08-16';

function getBackup(path) {
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
            parent[p.slice(0, p.lastIndexOf('.'))] = getBackup(`${path}/${p}`);
        }
    }
    return parent;
}

let b = getBackup(path, backup);
console.log(b);