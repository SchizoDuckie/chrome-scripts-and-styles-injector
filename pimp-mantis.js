
console.log("Pimping mantis with select2s!");

var fuzzy = function(term, text, opt) {
    return text.toUpperCase().match(term.toUpperCase().replace(/\s+/g, '.+'));
};

$('.login-info-right select').select2({
    matcher: fuzzy,
    width: '300px',

});

$('.select2-choice').css({'text-align':'left'});
//$('.select2-container .select2-choice div b').css({'content': '▼'});