const { logErr } = require('../config/logger')
const modelService = require('../services/model-service')
const packageJson = require('../../package.json')
const moment = require('moment')
const nunjucks = require('nunjucks')
const setting = require('../config/setting')

let scriptVersion = new Date().getTime()

const templateEngine = nunjucks.configure(`${setting.baseDir}/views`, {
    autoescape: true,
    noCache: true,
    tags: {
        variableStart: '<#',
        variableEnd: '#>',
    }
});

async function render(req, res, path, data = {}) {
    data.models = await modelService.get()
    data.query = req.query
    data.version = scriptVersion
    data.adminUser = req.adminUser || null
    data.projectVersion = packageJson.version
    data.dateNow = {
        day: moment().format('DD'),
        month: moment().format('MM'),
        year: moment().format('YYYY'),
        date: moment().format('DD.MM.YYYY')
    }

    templateEngine.render(`${setting.baseDir}/views/${path}.njk`, data, (err, build) => {
        if (err) {
            return logErr(null, err)
        }
        res.send(build)
    })
}

module.exports = {
    render
}