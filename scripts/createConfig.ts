let fs = require('fs');
let config = require('../config/index');

let base = __dirname + '/../config/';

if (process.env.NODE_ENV.trim() === 'local') {
    config.localServer = true;
}

fs.writeFileSync(
    base + 'config.js',
    'module.exports = ' + JSON.stringify(config) + ';'
);