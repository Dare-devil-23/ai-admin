const common = require('./common');

module.exports = {
    ...common,
    server: {
        port: '3000'
    },
    mode: 'LOCAL',    
    backendConfig: {
        "platform": {
            domain: 'http://localhost',
            port: '8080',
            folder: common.backendConfig.platform.folder            
        },
    }
}
