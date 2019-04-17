const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)
const readFile = promisify(require('fs').readFile)

async function get(req, res) {
    let templates = {}
    let folder = `${__dirname}/../../frontend/templates/components`
    let files = await readdir(folder)
    for (let file of files) {
        templates[file] = await readFile(`${folder}/${file}`, 'utf8')
    }
    res.send(templates)
}

module.exports = {
    get
}