const adminModel = require('../admin_models/admin_user')
const mainController = require('../controllers/main-controller')
const dataService = require('../services/data-service')
const helperService = require('../services/helper-service')
const validator = require('froncubator-validator-js')
const { logErr } = require('../config/logger')
const roles = {
    superadmin: 10,
    admin: 20,
    moderator: 30,
    view: 40
}

async function isAuth(req, res, next) {
    let admin
    let adminCount = await adminModel
        .find({ role: 'superadmin' })
        .count()

    if (adminCount > 0) {
        if (req.cookies.adminToken == undefined || req.cookies.adminToken == '')
            return res.redirect('/admin/login')

        admin = await adminModel
            .find({ token: req.cookies.adminToken })

        if (admin.length == 0)
            return res.redirect('/admin/login')
        else {
            req.adminUser = admin[0]
            req.adminUser.roleRate = roles[req.adminUser.role]
        }

        next()

    } else {
        return res.redirect('/admin/registration')
    }
}

async function isSuperAdmin(req, res, next) {
    if (req.adminUser == undefined || req.adminUser.roleRate > 10)
        return logErr(res, 'You need a diferent role to access this method')
    else
        return next()
}

async function isAdmin(req, res, next) {
    if (req.adminUser == undefined || req.adminUser.roleRate > 20)
        return logErr(res, 'You need a diferent role to access this method')
    else
        return next()
}

async function isModerator(req, res, next) {
    if (req.adminUser == undefined || req.adminUser.roleRate > 30)
        return logErr(res, 'You need a diferent role to access this method')
    else
        return next()
}

async function isView(req, res, next) {
    return next()
}

async function logoutAdmin(req, res) {
    if (req.cookies.adminToken != undefined && req.cookies.adminToken != '') {
        let admin = await dataService.get({
            model: 'AdminUser',
            token: req.cookies.adminToken
        })

        if (admin.data.length > 0) {
            await dataService.update({
                model: 'AdminUser',
                _id: admin.data[0]._id,
                token: ''
            })
        }
        res.clearCookie('adminToken')
    }

    return res.redirect('/admin')
}

async function getPageRegistration(req, res) {
    return await mainController.render(req, res, 'registration', {})
}

async function getPageLogin(req, res) {
    return await mainController.render(req, res, 'login', {})
}

async function loginAdmin(req, res) {
    let query = { ...req.body }

    if (!validator.isEmail(query.email)) {
        logErr(null, 'Email is invalid.')
        return await mainController.render(req, res, 'error', {
            message: 'Email is invalid.',
            refLink: req.headers.referer
        })
    }

    if (query.password.trim().length < 6) {
        logErr(null, 'Password must be greater than or equal to 6 characters')
        return await mainController.render(req, res, 'error', {
            message: 'Password must be greater than or equal to 6 characters',
            refLink: req.headers.referer
        })
    }

    try {
        query.model = 'AdminUser'
        let admin = await dataService.get(query)
        if (admin.data.length == 0)
            return res.redirect(`/admin/login`)

        await dataService.update({
            model: query.model,
            _id: admin.data[0]._id,
            token: (helperService.randomInt(100000, 10000000) + new Date().getTime()) + ''
        })

        admin = await dataService.get(query)
        res.cookie('adminToken', admin.data[0].token)
        res.redirect(`/admin`)
    } catch (err) {
        logErr(null, err)
        await mainController.render(req, res, 'error', {
            message: err,
            refLink: req.headers.referer
        })
    }
}

async function createAdmin(req, res) {
    let query = { ...req.body }

    let adminCount = await adminModel
        .find({ role: 'superadmin' })
        .count()

    if (adminCount > 0) {
        return res.redirect('/admin')
    }

    if (!validator.isEmail(query.email)) {
        logErr(null, 'Email is invalid.')
        return await mainController.render(req, res, 'error', {
            message: 'Email is invalid.',
            refLink: req.headers.referer
        })
    }

    if (query.password.trim().length < 6) {
        logErr(null, 'Password must be greater than or equal to 6 characters')
        return await mainController.render(req, res, 'error', {
            message: 'Password must be greater than or equal to 6 characters',
            refLink: req.headers.referer
        })
    }

    if (query.password != query['confirm-password']) {
        logErr(null, 'Password not equal Confirm Password')
        return await mainController.render(req, res, 'error', {
            message: 'Password not equal Confirm Password',
            refLink: req.headers.referer
        })
    }

    try {
        query.role = 'superadmin'
        query.model = 'AdminUser'
        delete query['confirm-password']
        await dataService.create(query)
        res.redirect(`/admin`)
    } catch (err) {
        logErr(null, err)
        await mainController.render(req, res, 'error', {
            message: err,
            refLink: req.headers.referer
        })
    }
}

module.exports = {
    isAuth,
    getPageRegistration,
    createAdmin,
    getPageLogin,
    loginAdmin,
    logoutAdmin,
    isSuperAdmin,
    isAdmin,
    isModerator,
    isView
}