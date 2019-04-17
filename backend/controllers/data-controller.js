const { logErr } = require('../config/logger')
const dataService = require('../services/data-service')


async function get(req, res) {
    try {
        if (req.query.model == undefined)
            return logErr(res, null, 'Field - model is required')

        if (
            req.query.model == 'AdminUser' &&
            req.query.role == 'superadmin' &&
            req.adminUser.roleRate > 10
        )
            return res.redirect('/admin')

        if (
            req.query.model == 'AdminUser' &&
            req.query.role == 'admin' &&
            req.adminUser.roleRate >= 20
        )
            return res.redirect('/admin')

        if (
            req.query.model == 'AdminUser' &&
            req.query.role == 'moderator' &&
            req.adminUser.roleRate >= 30
        )
            return res.redirect('/admin')

        let data = await dataService.get(req.query)
        res.send(data)
    } catch (err) {
        logErr(res, err)
    }
}

async function create(req, res) {
    try {
        if (req.body.model == undefined)
            return logErr(res, null, 'Field - model is required')

        if (req.body.model == 'AdminUser' && req.body.role == 'superadmin' && req.adminUser.roleRate > 10)
            return res.redirect('/admin')

        if (req.body.model == 'AdminUser' && req.body.role == 'admin' && req.adminUser.roleRate >= 20)
            return res.redirect('/admin')

        if (req.body.model == 'AdminUser' && req.body.role == 'moderator' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        let data = await dataService.create(req.body)
        res.send(data)
    } catch (err) {
        logErr(res, err)
    }
}

async function update(req, res) {
    try {
        if (req.body.model == undefined)
            return logErr(res, null, 'Field - model is required')

        if (req.body.model == 'AdminUser' && req.body.role == 'superadmin' && req.adminUser.roleRate > 10)
            return res.redirect('/admin')

        if (req.body.model == 'AdminUser' && req.body.role == 'admin' && req.adminUser.roleRate >= 20)
            return res.redirect('/admin')

        if (req.body.model == 'AdminUser' && req.body.role == 'moderator' && req.adminUser.roleRate >= 30)
            return res.redirect('/admin')

        let data = await dataService.update(req.body)
        res.send(data)
    } catch (err) {
        logErr(res, err)
    }
}

async function remove(req, res) {
    try {
        if (req.query.model == undefined)
            return logErr(res, null, 'Field - model is required')

        let data = await dataService.get(req.query)

        if (req.query.model == 'AdminUser' && data.data[0].role == 'superadmin' && req.adminUser.roleRate > 10)
            return logErr(res, null, 'You need a diferent role to access this method')

        if (req.query.model == 'AdminUser' && data.data[0].role == 'admin' && req.adminUser.roleRate >= 20)
            return logErr(res, null, 'You need a diferent role to access this method')

        if (req.query.model == 'AdminUser' && data.data[0].role == 'moderator' && req.adminUser.roleRate >= 30)
            return logErr(res, null, 'You need a diferent role to access this method')

        data = await dataService.remove(req.query)
        res.send(data)
    } catch (err) {
        logErr(res, err)
    }
}

module.exports = {
    get,
    create,
    update,
    remove
}