const common = require('./common');

module.exports = {
    ...common,   
    mode: 'QA',    
    backendConfig: {
        "platform": {
            domain: 'https://qa-platform.fc.one',
            port: '',
            folder: common.backendConfig.platform.folder            
        },
        "dashify": {
            domain: 'https://qa-dashify.fc.one',
            port: '',
            folder: common.backendConfig.dashify.folder
        }
    }
}