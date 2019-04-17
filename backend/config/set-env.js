const { promisify } = require('util')
const readFile = promisify(require('fs').readFile)
const mkdirp = require('mkdirp')

// set process.env from data.env file
module.exports = async function(envPath = '../../data.env') {
    if (process.env.IS_DOCKER_ENV == undefined || process.env.IS_DOCKER_ENV == 0) {
        const envRaw = await readFile(envPath, 'utf8')
        const envList = envRaw.split('\n')

        for (e of envList) {
            e = e.trim()
            if (e != '') {
                let index = e.indexOf('=')
                process.env[e.substr(0, index - 1)] = e.substr(index + 1)
            }
        }
    }

    // create upload-dir before files uploaded on the server.
    mkdirp(process.env.UPLOAD_DIR)
}