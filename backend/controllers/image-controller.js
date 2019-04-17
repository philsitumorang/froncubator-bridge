const { logErr } = require('../config/logger')
const promisify = require('util').promisify
const sharp = require('sharp')
const imageSize = promisify(require('image-size'))
const modelService = require('../services/model-service')


async function uploadFile(req, res) {
    res.send({
        'uploaded': 1,
        'fileName': req.file.filename,
        'url': `/admin/static/uploads/${req.file.filename}`
    })
}

async function uploadImageTextRich(req, res) {
    await sharp(req.file.path).jpeg({ quality: 90 })
        .toFile(`${req.file.destination}/t_${req.file.filename}`)

    res.send({
        'uploaded': 1,
        'fileName': req.file.filename,
        'url': `/admin/static/uploads/t_${req.file.filename}`
    })
}

async function uploadImage(req, res) {
    try {
        let modelSchema = await modelService.getSchema(req.body.model)
        let currentField = null
        for (let field of modelSchema) {
            if (field.name == req.body.field) {
                currentField = field
                break
            }
        }

        let dimensions = await imageSize(req.file.path)

        if (currentField) {
            let width = currentField.image.sizes[0]
            let height = currentField.image.sizes[1]

            if (Number.isInteger(width) || Number.isInteger(height)) {
                if (dimensions.width > width && dimensions.height > height) {
                    await sharp(req.file.path)
                        .resize(width, height)
                        .crop()
                        .jpeg({ quality: 90 })
                        .toFile(`${req.file.destination}/t_${req.file.filename}`)
                } else if (dimensions.width > width && dimensions.height < height) {
                    await sharp(req.file.path)
                        .resize(width, null)
                        .crop()
                        .jpeg({ quality: 90 })
                        .toFile(`${req.file.destination}/t_${req.file.filename}`)
                } else if (dimensions.width < width && dimensions.height > height) {
                    await sharp(req.file.path)
                        .resize(null, height)
                        .crop()
                        .jpeg({ quality: 90 })
                        .toFile(`${req.file.destination}/t_${req.file.filename}`)
                } else {
                    await sharp(req.file.path).jpeg({ quality: 90 })
                        .toFile(`${req.file.destination}/t_${req.file.filename}`)
                }
            }
        } else {
            await sharp(req.file.path).jpeg({ quality: 90 })
                .toFile(`${req.file.destination}/t_${req.file.filename}`)
        }

        res.send({
            'uploaded': 1,
            'fileName': req.file.filename,
            'url': `/admin/static/uploads/t_${req.file.filename}`
        })
    } catch (err) {
        logErr(res, err)
    }
}

module.exports = {
    uploadFile,
    uploadImage,
    uploadImageTextRich
}
