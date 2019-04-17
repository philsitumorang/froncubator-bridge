const { logErr } = require('../config/logger')
const modelService = require('../services/model-service')
const mainController = require('./main-controller')


async function getPage(req, res) {
    try {
        await mainController.render(req, res, 'index')
    } catch (err) {
        logErr(res, err)
    }
}


module.exports = {
    getPage
}