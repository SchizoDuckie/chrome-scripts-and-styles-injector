// set some default settings.
/* if (!('pimp_always' in localStorage)) {
    chrome.storage.local.set({
        'pimp_always': 1
    }, function() {

    });
}

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
        if (tab.url.indexOf('support.samson-it.nl') > -1) {
            var ticket = tab.url.match(/id=([0-9]+)/)[0];
            chrome.storage.local.set({
                'lastOpenTicket': ticket
            }, function() {});
        }
    }
};*/

console.log("Im the background page, yay!");

var injectorListener = function(request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    console.log("request", request, sender);

    if (request.can_i_haz) {
        switch (request.can_i_haz) {
            case 'active_ticket':
                chrome.tabs.query({}, function(tabs) {
                    var activeTab = tabs.filter(function(tab) {
                        return tab.selected == 1;
                    }).pop();
                    if (activeTab && activeTab.url && activeTab.url.indexOf('view.php?id=') > -1) {
                        console.log("Here u haz tabs: ", activeTab);
                        chrome.extension.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
                            here_u_haz: 'active_ticket',
                            ticket: activeTab.title
                        }, function(response) {});

                    }

                });
                break;
        }
    }
    if (request.can_i) {
        switch (request.can_i) {
            case 'style_for_tab':
                if (!sender.tab) {
                    console.log("Yes you can!");
                    chrome.tabs.query({
                        active: true
                    }, function(tabs) {
                        chrome.extension.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
                            you_can: 'style_for_tab'
                        }, function(response) {});
                    });
                } else {
                    if (localStorage.getItem('pimp_always') == '1') {

                        chrome.tabs.sendMessage(sender.tab.id, {
                            you_can: 'override_tahoma'
                        });
                    }
                }
                break;
            case 'pimp':
                if (!sender.tab) {
                    console.log("Yes you can!");

                    chrome.tabs.query({
                        active: true,
                    }, function(tabs) {
                        chrome.extension.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
                            you_can: 'pimp'
                        }, function(response) {});
                    });

                } else {
                    if (localStorage.getItem('pimp_always') == '1') {
                        console.log("Yes you can!");

                        chrome.tabs.sendMessage(sender.tab.id, {
                            you_can: 'pimp'
                        });
                    }

                }

                break;
        }
    } else {
        console.error("No request.can_i!");
    }
};

chrome.runtime.onMessage.addListener(injectorListener);

chrome.browserAction.onClicked.addListener(function() {
    setTimeout(function() {
        localStorage.setItem('lastOpened', new Date().getTime());
    }, 2000);
});