var browserListener = function(tab) {
    var regexPage = new RegExp(/https:\/\/tr.samson-it.nl\//); // We use a regular expresion to check which page was given.
    var match = regexPage.exec(tab.url); // We then check if the given page matches our expression.
    // If it matches and the status of the tab is complete...
    if (match && tab.status === 'complete') {
        //We insert the css

        chrome.tabs.insertJavascript(tab.id, {
            file: "script.js"
        });
        
    } else {
        if(tab.url.indexOf('support.samson-it.nl') > -1) {
            var ticket = tab.url.match(/id=([0-9]+)/)[0];
            localStorage.setItem('lastOpenTicket', ticket);
        }
    }
};

chrome.browserAction.onClicked.addListener(browserListener);