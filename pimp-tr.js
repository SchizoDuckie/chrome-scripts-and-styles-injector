console.info("Executing pimp-tr script");

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
	width: '205px'
});

$('select.projecten').select2({
	matcher: fuzzy,
	width: '420px'
});

$('.numberInput.startTijd, .numberInput.eindTijd').attr('placeholder', '12:00');


$('select.projecten').change(function(e) {

	setTimeout(function() {
		$('select.projectOnderdelen').select2({
			matcher: fuzzy,
			width: '40%'
		});

	}, 50);
});


var e = $.Event('keyup');
e.keyCode = 190; // Character '.'
$(".arbeidOmschrijving").last().trigger(e);


if (window.location.href.indexOf('dag.php') > -1) {
	var dateContainer = document.querySelector('#mainContent > h2').innerText;

	var date = dateContainer.split(',')[2].trim();
	if (new Date(date).toDateString() == new Date().toDateString()) { // only run on today
		var eindTijd = document.querySelectorAll('.eindTijd');
		var startTijd = document.querySelectorAll('.startTijd');

		st = startTijd[startTijd.length - 1];

		startTijd = new Date(new Date().toDateString() + ' ' + st.value);
		var et = new Date();

		if (((et.getTime() - startTijd.getTime()) / 1000 / 60 / 60) > 0.05) {
			eindTijd = eindTijd[eindTijd.length - 1];
			eindTijd.value = new Date().toTimeString().substr(0, 5);
			eindTijd.onchange();
			$(".arbeidOmschrijving").last().focus();
		}

	}
}