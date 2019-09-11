const setting = require('../config/setting')
const mongoose = require('mongoose')
const validator = require('froncubator-validator-js')
const { logInfo, logErr } = require('../config/logger')
const chalk = require('chalk')

async function connect() {

    logInfo(null, chalk.green('[froncubator-bridge]') + ` Connecting to db...`)

    let url = ''

    if (
        (validator.isExist(setting.config.mongo.auth) && setting.config.mongo.auth) &&
        (validator.isExist(setting.config.mongo.user) &&
        validator.isExist(setting.config.mongo.pass))
    ) {
        url = `mongodb://${setting.config.mongo.user}:${setting.config.mongo.pass}@${setting.config.mongo.url}:${setting.config.mongo.port}/${setting.config.mongo.dbName}`
    } else {
        url = `mongodb://${setting.config.mongo.url}:${setting.config.mongo.port}/${setting.config.mongo.dbName}`
    }

    let mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    try {
        await mongoose.connect(url, mongooseOptions)
        logInfo(null, chalk.green('[froncubator-bridge]') + ` Connected to database.`)
    } catch(err) {
        logErr(null, chalk.red('[froncubator-bridge]') + err.stack)
        setTimeout(async () => {
            logInfo(null, chalk.green('[froncubator-bridge]') + ` Reconnect to DB...`)
            await connect()
        }, 5000)
    }
}

module.exports = {
    connect
}
