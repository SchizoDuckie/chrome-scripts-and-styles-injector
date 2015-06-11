console.log("Im the background page, yay!");

var injectorListener = function(request, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    console.log("request", request, sender);
    if (request.here_u_haz) {
        switch (request.here_u_haz) {
            case 'total_today':
                var time = request.total_today.match(/([0-9]{2})u ([0-9]{2})m/).slice(1).join(':');
                if (time[0] == '0') time = time.substr(1);
                chrome.browserAction.setBadgeText({
                    text: time
                });
                chrome.browserAction.setBadgeBackgroundColor({
                    color: [25, 25, 25, 150]
                });
                //"0d 08u 32m in 10 regels"
                break;
        }
    }
    if (request.can_i_haz) {
        switch (request.can_i_haz) {
            case 'active_ticket':
                chrome.tabs.query({}, function(tabs) {
                    var activeTab = tabs.filter(function(tab) {
                        return tab.selected == 1;
                    }).pop();
                    if (activeTab && activeTab.url && activeTab.url.indexOf('view.php?id=') > -1) {
                        console.log("Here u haz tabs: ", activeTab);
                        chrome.extension.sendMessage(chrome.runtime.id, {
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
            case 'override_tahoma':
                if (!sender.tab) {
                    console.log("Yes you can!");
                    chrome.tabs.query({
                        active: true
                    }, function(tabs) {
                        if (localStorage.getItem('tahoma') == '1') {
                            chrome.extension.sendMessage(chrome.runtime.id, {
                                you_can: 'override_tahoma'
                            }, function(response) {});
                        }
                    });
                } else {
                    if (localStorage.getItem('tahoma') == '1') {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            you_can: 'override_tahoma'
                        });
                    }
                }
                break;
            case 'style_for_tab':
                if (!sender.tab) {
                    console.log("Yes you can!");
                    chrome.tabs.query({
                        active: true
                    }, function(tabs) {
                        chrome.extension.sendMessage(chrome.runtime.id, {
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
            case 'pimp_tr':
                if (!sender.tab) {
                    console.log("Yes you can!");

                    chrome.tabs.query({
                        active: true,
                    }, function(tabs) {
                        chrome.extension.sendMessage(chrome.runtime.id, {
                            you_can: 'pimp_tr'
                        }, function(response) {});
                    });

                } else {
                    if (localStorage.getItem('pimp_always') == '1') {
                        console.log("Yes you can!");
                        chrome.tabs.sendMessage(sender.tab.id, {
                            you_can: 'pimp_tr'
                        }, function(response) {});
                    }

                }

                break;
            case 'pimp_mantis':
                chrome.tabs.sendMessage(sender.tab.id, {
                    you_can: 'pimp_mantis'
                }, function(response) {});
                break;
        }
    } else {
        console.error("No request.can_i or request.can_i_haz!", request, sender);
    }
};

chrome.extension.onMessage.addListener(injectorListener);