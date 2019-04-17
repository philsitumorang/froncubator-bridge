const moment = require('moment')
const { logInfo } = require('../config/logger')
const modelService = require('../services/model-service')
const userService = require('../services/user-service')
const helperService = require('../services/helper-service')
const helper = require('../helper')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


function pagination(c, m) {
    let current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i)
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
}

async function get(q) {
    let query = { ...q }
    let model = mongoose.model(query.model)

    let modelSchema = await modelService.getSchema(query.model)
    let limit = 20
    let page = query.page - 1
    let dataCount = 0
    let pageCount = 0
    let relationFields = []
    let pages = null
    let search = query._search
    let sort = query._sort

    delete query.model
    delete query.page
    delete query.notify
    delete query._msg
    delete query._search
    delete query._sort

    if (page < 0)
        page = 0

    for (let field of modelSchema) {
        if (
            field.show != undefined &&
            field.show &&
            search != undefined &&
            search != '' &&
            field.type.name != 'Date' &&
            field.type.name != 'Array' &&
            field.type.name != 'Object'
        ) {
            let obj = {}

            if (query['$or'] == undefined)
                query = { $or: [] }

            if (field.type.name == 'Number') {
                if (Number.isInteger(+search)) {
                    obj[field.name] = search
                    query['$or'].push(obj)
                }
            }
            else if (
                field.search_inaccurate != undefined &&
                field.search_inaccurate
            ) {
                obj[field.name] = new RegExp(search, 'gi')
                query['$or'].push(obj)
            } else {
                obj[field.name] = search
                query['$or'].push(obj)
            }
        }
        else if (field.relationMulty != undefined) {
            relationFields.push({
                name: field.name,
                relationMulty: field.relationMulty
            })
        }
        else if (field.crypto != undefined && field.crypto == 'sha256') {
            if (query[field.name] != undefined && query[field.name] != '')
                if (!helperService.isSha256Valid(query[field.name]))
                    query[field.name] = userService.toSha256(query[field.name])
        }
    }

    if (sort !== undefined && sort.indexOf(':') !== -1) {
        let sortSplited = sort.split(':')
        sortSplited[1] = sortSplited[1] === 'asc' ? 1 : -1

        sort = {}
        sort[sortSplited[0]] = sortSplited[1]
    } else {
        sort = null
    }

    if (sort === null) {
      sort = { _id: -1 }
    }

    dataCount = await model.count(query)
    pageCount = Math.ceil(dataCount / limit)
    pages = pagination(page + 1, pageCount)

    let data = await model
        .find(query)
        .lean()
        .sort(sort)
        .skip(page * limit)
        .limit(limit)

    for (let d of data) {
        d.modelSchema = modelSchema

        for (key in d) {
            let rFoundIndex = helper.inArray(relationFields, key, 'name')
            if (rFoundIndex != -1) {
                if (!Array.isArray(d[key]))
                    d[key] = [d[key]]
                if (d[key].length > 0) {
                    let toData = []
                    let m = mongoose.model(relationFields[rFoundIndex].relationMulty)
                    for (let id of d[key]) {
                        if (
                            id != undefined &&
                            ObjectId.isValid(id) &&
                            id.length == 24
                        ) {
                            toData.push(
                                await m.findOne({ _id: id })
                            )
                        }
                    }
                    d[key] = toData
                }
            }
        }

        for (let schema of d.modelSchema) {
            if (
                schema.show !== undefined &&
                schema.show === true &&
                schema.relation !== undefined &&
                d[schema.name] !== '' &&
                query._id == undefined
            ) {
                try {
                    let relSchema = await modelService.getSchema(schema.relation)
                    let relModel = mongoose.model(schema.relation)
                    let relData = await relModel
                        .findOne({ _id: d[schema.name] })

                    for (let f of relSchema) {
                        if (f.selectTitle != undefined) {
                            currentField = f.name
                            break
                        }
                    }

                    if (currentField)
                        d[schema.name] = relData[currentField]
                } catch (err) {
                    logInfo(null, err)
                }
            }
            if (
                schema.type !== undefined &&
                schema.type.name === 'Date'
            ) {
                try {
                    d[schema.name] = moment(d[schema.name]).format('DD.MM.YYYY hh:mm:ss')
                } catch(err) {
                    logInfo(null, err)
                }
            }
        }
    }

    return {
        data,
        pageCount,
        pages
    }
}

async function create(q) {
    let query = { ...q }
    let model = mongoose.model(query.model)
    let modelSchema = await modelService.getSchema(query.model)

    delete query.model

    let data = new model()

    for (let key in query) {
        let i = helper.inArray(modelSchema, key, 'name')

        if (modelSchema[i].type.name == 'Array' && query[key] == '[]')
            query[key] = []

        if (modelSchema[i].type.name == 'Boolean' && query[key] == true)
            query[key] = true

        if (modelSchema[i].type.name == 'Boolean' && query[key] == false)
            query[key] = false

        if (modelSchema[i].crypto != undefined && modelSchema[i].crypto == 'sha256')
            if (!helperService.isSha256Valid(query[key])) {
                query[key] = userService.toSha256(query[key])
            }

        data[key] = query[key]
    }

    await data.save()

    return data
}

async function update(q) {
    let query = { ...q }
    let model = mongoose.model(query.model)
    let modelSchema = await modelService.getSchema(query.model)
    let _id = query._id

    delete query.model
    delete query._id

    let data = await model.findOne({
        _id
    })

    for (let key in query) {
        let i = helper.inArray(modelSchema, key, 'name')

        if (modelSchema[i].type.name == 'Array' && query[key] == '[]')
            query[key] = []

        if (modelSchema[i].type.name == 'Boolean' && query[key] == true)
            query[key] = true

        if (modelSchema[i].type.name == 'Boolean' && query[key] == false)
            query[key] = false

        if (modelSchema[i].crypto != undefined && modelSchema[i].crypto == 'sha256')
            if (!helperService.isSha256Valid(query[key])) {
                query[key] = userService.toSha256(query[key])
            }

        data[key] = query[key]
    }

    await data.save()

    return data
}

async function remove(q) {
    let query = { ...q }
    let model = mongoose.model(query.model)
    let data = await model.deleteOne({ _id: query._id })

    return data
}

module.exports = {
    get,
    create,
    update,
    remove
}
