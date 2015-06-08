var isExtension = false;

try {
    // not allowed to access window.frames.top in chrome extension, so we're in popup mode. 
    // commence injecting custom css.
    console.log("Pimping Your TR?", window.frames.top.location.href);
} catch (E) {
    isExtension = true;
}

if(isExtension) {
    console.log("Yepz. Commence styling.");
    var c = document.createElement('style');
    c.type = 'text/css';
    var css = [
        'body { font-family: sans-serif !important; margin:0; padding: 0; width: 600px !important; background-color:white; overflow-x:hidden;}',
        'div#mainHeader, div#mainFooter { display:none !important; }',
        'div#mainContent { padding:0; min-height: initial; background-color:white;  }',
        '.Header, .Record, .Grid { width: initial }',
        'input.required.arbeidOmschrijving { width: 100% !important; float:left; } ',
        'table.Grid th:nth-child(1), table.Grid th:nth-child(6), table.Grid th:nth-child(7), table.Grid th:nth-child(8) { display: none; }',
        'table.Grid td:nth-child(1), table.Grid td:nth-child(6), table.Grid td:nth-child(7), table.Grid td:nth-child(8) { display: none; }',
        '#mainContent > p { display:none; }',
        'th:last-child { overflow: hidden; font-size: 9px; -webkit-transform: rotate(-90deg) translateX(-2px)translateY(-8px); padding-top: 20px;}',
        '#mainContent h2 { display:none; } ',
        'th, span, input { font-family: sans-serif} ',
        'input[id^="arbeidfacturabel_"] { display:block; width: 30px; float:left; }',
        'label[for^="arbeidfacturabel_"] { display:inline-block; float: left; }'
    ];
    c.appendChild(document.createTextNode(css.join('\n')));
    document.body.appendChild(c);
}

//$('input.')
var fuzzy = function(term, text, opt) {
    return text.toUpperCase().match(term.toUpperCase().replace(/\s+/g, '.+'));
};

$('select:not(.projecten)').select2({
    matcher: fuzzy,
    width: '49%'
});

$('select.projecten').select2({
    matcher: fuzzy,
    width: '100%'
});

$('select.projecten').change(function(e) {

    setTimeout(function() {
        $('select.projectOnderdelen').select2({
            matcher: fuzzy,
            width: '40%'
        });

    }, 50);

});

var lastOpened = localStorage.getItem('lastOpened');

if(lastOpened !== null) {
    var diff = new Date().getTime() - parseInt(lastOpened);
    var inputs = $('.arbeidDuur');
    var lastOne = inputs[inputs.length -1];
    lastOne.value = new Number(diff / 60 / 60 / 60 / 60).toFixed(2);
}

document.querySelector('form').addEventListener('submit', function() {
    localStorage.setItem('lastOpened', new Date().getTime());
    setTimeout(function() {
        window.close();
    }, 500);
});


/**
 * Options-setter patched so that it selects the default value.
 */
function createOptionsFromText(selectObj,optionsText) {
    var optionCounter=0;
    var reg=/^([^=]*)=(.*)$/;
    selectObj.options.length=0;
    var lines=optionsText.split(/[\n\r]|[\n]/);
    for(i=0;i<lines.length;i++) {
        var parsed=reg.exec(lines[i]);
        if(parsed) { 
            selectObj.options[optionCounter++]=new Option(parsed[2],parsed[1]);
            if(parsed[2].charAt(0)=='*') {
                selectObj.options[optionCounter-1].text=selectObj.options[optionCounter-1].text.substr(1);
                selectObj.selectedIndex=optionCounter-1;
                $(selectObj).select2("val", parsed[1]);
            }
        }
    }
}