function randomInt(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand)
    return rand
}

function isSha256Valid(val) {
    if (val.length !== 64)
        return false

    if (val.match(/[^a-fA-F0-9]/gi) !== null)
        return false

    return true
}

module.exports = {
    randomInt,
    isSha256Valid
}