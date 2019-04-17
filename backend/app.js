module.exports = async function(app, config) {
    let setting = require('./config/setting')
    setting.baseDir = __dirname

    const mkdirp = require('mkdirp')
    mkdirp(setting.config.uploadDir)

    const path = require('path')
    const express = require('express')
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const multer = require('multer')

    const db = require('./config/db')
    db.connect()

    const adminController = require('./controllers/admin-controller')
    const indexController = require('./controllers/index-controller')
    const modelController = require('./controllers/model-controller')
    const dataController = require('./controllers/data-controller')
    const templateController = require('./controllers/template-controller')
    const imageController = require('./controllers/image-controller')

    const imageStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, setting.config.uploadDir)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })

    const upload = multer({ storage: imageStorage })

    app.use('/admin/static/build', express.static(`${__dirname}/../frontend/build`))
    app.use('/admin', cookieParser())
    app.use('/admin', bodyParser.json({ limit: '50mb' }))
    app.use('/admin', bodyParser.urlencoded({ limit: '50mb', extended: true }))

    app.get('/admin', adminController.isAuth, indexController.getPage)
    app.get('/admin/logout', adminController.logoutAdmin)
    app.post('/admin/create', adminController.createAdmin)
    app.get('/admin/registration', adminController.getPageRegistration)
    app.post('/admin/signin', adminController.loginAdmin)
    app.get('/admin/login', adminController.getPageLogin)
    app.get('/admin/model', adminController.isAuth, modelController.getPage)
    app.get('/admin/model/edit', [adminController.isAuth], modelController.getEditPage)
    app.post('/admin/model/edit/save', [adminController.isAuth, adminController.isModerator], modelController.editModel)
    app.get('/admin/model/create', [adminController.isAuth, adminController.isModerator], modelController.getCreatePage)
    app.post('/admin/model/create/save', [adminController.isAuth, adminController.isModerator], modelController.createModel)

    app.get('/admin/api/v1/templates', adminController.isAuth, templateController.get)
    app.get('/admin/api/v1/model', adminController.isAuth, modelController.get)
    app.get('/admin/api/v1/model/schema', adminController.isAuth, modelController.getSchema)

    app.get('/admin/api/v1/data', adminController.isAuth, dataController.get)
    app.post('/admin/api/v1/data', [adminController.isAuth, adminController.isModerator], dataController.create)
    app.put('/admin/api/v1/data', [adminController.isAuth, adminController.isModerator], dataController.update)
    app.delete('/admin/api/v1/data', [adminController.isAuth, adminController.isModerator], dataController.remove)

    app.post('/admin/api/v1/data/file', [adminController.isAuth, adminController.isModerator, upload.single('upload')], imageController.uploadFile)
    app.post('/admin/api/v1/data/image', [adminController.isAuth, adminController.isModerator, upload.single('upload')], imageController.uploadImage)
    app.post('/admin/api/v1/data/image_textrich', [adminController.isAuth, adminController.isModerator, upload.single('upload')], imageController.uploadImageTextRich)
}
