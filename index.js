module.exports = async function (app, config) {
    const setting = require('./backend/config/setting')
    setting.config = config

    const { promisify } = require('util')
    const fs = require('fs-extra')
    const exec = require('child_process').exec
    const backend = require('./backend/app')
    const validator = require('froncubator-validator-js')
    const chalk = require('chalk')
    const { logErr, logInfo } = require('./backend/config/logger')

    logInfo(null, chalk.green('[froncubator-bridge]') + ' start...')

    if (!validator.isExist(config)) {
        logErr(null, chalk.red('[froncubator-bridge]') + ' - config is required')
        return false
    }

    if (!validator.isExist(config.mongo)) {
        logErr(null, chalk.red('[froncubator-bridge]') + ' - config.mongo is required')
        return false
    }

    if (!validator.isExist(config.mongo.dbName) || config.mongo.dbName == '') {
        logErr(null, chalk.red('[froncubator-bridge]') + ' - config.mongo.dbName is required or is empty')
        return false
    }

    if ((!validator.isExist(config.mongo.user) || config.mongo.user == '') && !validator.isExist(config.mongo.auth)) {
        logErr(null, chalk.red('[froncubator-bridge]') + ' - (config.mongo.user || config.mongo.pass) is required or config.mongo.auth is required')
        return false
    }

    if (!validator.isExist(config.mongo.url)) {
        config.mongo.url = '127.0.0.1'
    }

    if (!validator.isExist(config.mongo.port)) {
        config.mongo.port = '27017'
    }

    if (!validator.isExist(setting.logsDir)) {
        setting.logsDir = './admin-logs'
    }

    await backend(app, config)

    // exec(`cd ${__dirname}/frontend && gulp`, (error, stdout, stderr) => {
    //     logInfo(null, '[froncubator-bridge] build frontend...')

    //     if (error) {
    //         logErr(null, chalk.red('[froncubator-bridge] ') + error)
    //         return false
    //     }

    //     logInfo(null, chalk.green('[froncubator-bridge] ') + stdout)

    //     if (stderr) {
    //         logErr(null, chalk.red('[froncubator-bridge] ') + stderr)
    //     }
    // })
}