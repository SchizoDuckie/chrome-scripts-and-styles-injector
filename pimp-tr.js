    /**
     * Options-setter patched so that it selects the default value for select2's
     */
    createOptionsFromText = function(selectObj, optionsText) {
        var optionCounter = 0;
        var reg = /^([^=]*)=(.*)$/;
        selectObj.options.length = 0;
        var lines = optionsText.split(/[\n\r]|[\n]/);
        for (i = 0; i < lines.length; i++) {
            var parsed = reg.exec(lines[i]);
            if (parsed) {
                selectObj.options[optionCounter++] = new Option(parsed[2], parsed[1]);
                if (parsed[2].charAt(0) == '*') {
                    selectObj.options[optionCounter - 1].text = selectObj.options[optionCounter - 1].text.substr(1);
                    selectObj.selectedIndex = optionCounter - 1;
                    $(selectObj).select2("val", parsed[1]);
                }
            }
        }
    };

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

    /* if (lastOpened !== null) {
        var diff = new Date().getTime() - parseInt(lastOpened);
        var inputs = $('.arbeidDuur');
        var input = inputs[inputs.length - 1];
        if (diff !== 0) {
            var val = diff / 1000 / 60 / 60 / 60 / 60;
        //    input.value = diff.toFixed(2);
        }
        localStorage.setItem('lastOpened', new Date().getTime());
    }*/