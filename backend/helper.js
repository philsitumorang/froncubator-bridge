const helper = {}

helper.inArray = function(arr, value, field) {
    let result = -1
    for (let i = 0; i < arr.length; i++) {
        if (field != undefined) {
            if (arr[i][field] == value) {
                result = i
                break
            }
        } else {
            if (arr[i] == value) {
                result = i
                break
            }
        }
    }

    return result
}

module.exports = helper