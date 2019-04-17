const winston = require('winston')
const mkdirp = require('mkdirp')
const moment = require('moment')
const setting = require('./setting')

mkdirp(setting.config.logsDir)

let data = {
    logger: new winston.Logger({
        transports: [
            new (winston.transports.Console)(),
            new (winston.transports.File)({
                name: 'info',
                filename: `${setting.config.logsDir}/info-${moment().format('DD-MM-YYYY')}.log`,
                level: 'info'
            }),
            new (winston.transports.File)({
                name: 'error',
                filename: `${setting.config.logsDir}/error-${moment().format('DD-MM-YYYY')}.log`,
                level: 'error'
            })
        ]
    }),
    logErr: function (res, err, message = 'Server error') {
        if (err != null)
            data.logger.log('error', err)
        if (res != null)
            res.send({
                err: message
            })
    },
    logInfo: function (res, message = '') {
        data.logger.log('info', message)
        if (res != null)
            res.send({
                notify: message
            })
    }
}

module.exports = data