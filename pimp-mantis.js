
console.log("Pimping mantis with select2s!");

var fuzzy = function(term, text, opt) {
    return text.toUpperCase().match(term.toUpperCase().replace(/\s+/g, '.+'));
};

$('.login-info-right select').select2({
    matcher: fuzzy,
    width: 300
});
