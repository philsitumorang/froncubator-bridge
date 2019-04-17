const { logErr } = require('../config/logger')
const modelService = require('../services/model-service')
const dataService = require('../services/data-service')
const mainController = require('./main-controller')


async function getPage(req, res) {
    try {
        let query = { ... req.query }

        if (query.model == 'AdminUser' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        let data = await dataService.get(query)
        return await mainController.render(req, res, 'models', data)
    } catch (err) {
        logErr(res, err)
    }
}

async function getEditPage(req, res) {
    try {
        let query = { ... req.query }
        let data = await dataService.get(query)

        if (req.query.model == 'AdminUser' && data.data[0].role == 'superadmin' && req.adminUser.roleRate > 10)
            return res.redirect('/admin')

        if (req.query.model == 'AdminUser' && data.data[0].role == 'admin' && req.adminUser.roleRate >= 20)
            return res.redirect('/admin')

        if (req.query.model == 'AdminUser' && data.data[0].role == 'moderator' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        return await mainController.render(req, res, 'models-edit', data)
    } catch (err) {
        logErr(res, err)
    }
}

async function getCreatePage(req, res) {
    try {
        let data = {}
        let query = { ...req.query }

        data.schema = await modelService.getSchema(query.model)
        return await mainController.render(req, res, 'models-create', data)
    } catch (err) {
        logErr(res, err)
    }
}

async function editModel(req, res) {
    let query = { ... req.body }
    try {

        if (query.model == 'AdminUser' && query.role == 'superadmin' && req.adminUser.roleRate > 10)
            return res.redirect('/admin')

        if (query.model == 'AdminUser' && query.role == 'admin' && req.adminUser.roleRate >= 20)
            return res.redirect('/admin')

        if (query.model == 'AdminUser' && query.role == 'moderator' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        await dataService.update(query)
        res.redirect(`/admin/model/edit?model=${req.body.model}&_id=${req.body._id}&notify=success`)
    } catch (err) {
        logErr(null, err)
        await mainController.render(req, res, 'error', {
            message: err,
            refLink: req.headers.referer
        })
    }
}

async function createModel(req, res) {
    let query = { ...req.body }
    try {

        if (query.model == 'AdminUser' && query.role == 'superadmin' && req.adminUser.roleRate > 10)
            return res.redirect('/admin')

        if (query.model == 'AdminUser' && query.role == 'admin' && req.adminUser.roleRate >= 20)
            return res.redirect('/admin')

        if (query.model == 'AdminUser' && query.role == 'moderator' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        await dataService.create(query)
        res.redirect(`/admin/model?model=${req.body.model}&page=1`)
    } catch (err) {
        logErr(null, err)
        await mainController.render(req, res, 'error', {
            message: err,
            refLink: req.headers.referer
        })
    }
}

async function get(req, res) {
    try {
        let models = await modelService.get()
        res.send(models)
    } catch (err) {
        logErr(res, err)
    }
}

async function getSchema(req, res) {
    try {
        let schema = await modelService.getSchema(req.query.model)
        res.send(schema)
    } catch (err) {
        logErr(res, err)
    }
}


module.exports = {
    get,
    getPage,
    getEditPage,
    editModel,
    createModel,
    getCreatePage,
    getSchema
}