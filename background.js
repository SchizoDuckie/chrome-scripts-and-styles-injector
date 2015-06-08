var browserListener = function(tab) {
    var regexPage = new RegExp(/https:\/\/tr.samson-it.nl\//); // We use a regular expresion to check which page was given.
    var match = regexPage.exec(tab.url); // We then check if the given page matches our expression.
    // If it matches and the status of the tab is complete...
    if (match && tab.status === 'complete') {
        //We insert the css

        chrome.tabs.insetJavascript(tab.id, {
            file: "script.js"
        });
    }
};

chrome.browserAction.onClicked.addListener(browserListener);