var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: { name: 'GProg' },
        port: 5000,
        db: 'mongodb://127.0.0.1/helpMe-dev',
        secret: "cayennedlikedhistreats",
        uploads: './public/uploadedFiles' 
    },
    test: {
        root: rootPath,
        app: { name: 'GProg' },
        port: 4000,
        db: 'mongodb://127.0.0.1/helpMe-test',
        uploads: './public/uploadedFiles' 
    },
    production: {
        root: rootPath,
        app: { name: 'GProg' },
        port: 80,
        db: 'mongodb://127.0.0.1/helpMe',
        uploads: './public/uploadedFiles' 
    }
};

module.exports = config[env];
