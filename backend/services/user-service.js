const crypto = require('crypto')

function sha256(val) {
    const secret = 'SDGIJxcbj43537esFSefasfkxlbjdfwevvdfs'
    const hash = crypto
        .createHmac('sha256', secret)
        .update(val)
        .digest('hex')

    return hash
}

function toSha256(val) {
    return sha256(val)
}

module.exports = {
    toSha256
}