function toggleCheckBox(e, name) {
    var elm = $(e.target);

    if (elm.prop('checked')) {
        $('input[name="' + name + '"]').val(true)
    } else {
        $('input[name="' + name + '"]').val(false)
    }
}