const mongoose = require('mongoose')
let models = mongoose.modelNames()

function getSchema(modelName) {
    let schema = mongoose.model(modelName).schema.tree
    let model = []
    for (let schemaName in schema) {
        model.push({
            name: schemaName,
            type: schema[schemaName].type,
            component: schema[schemaName].component,
            show: schema[schemaName].show,
            verb_name: schema[schemaName].verb_name,
            link: schema[schemaName].link,
            relation: schema[schemaName].relation,
            relationMulty: schema[schemaName].relationMulty,
            search_inaccurate: schema[schemaName].search_inaccurate,
            values: schema[schemaName].values,
            image: schema[schemaName].image,
            crypto: schema[schemaName].crypto,
            selectTitle: schema[schemaName].selectTitle
        })
    }

    return model
}

function get() {
    return models
}

module.exports = {
    getSchema,
    get
}
