console.log("Im the background page, yay!");

var HTMLScraper = function(text, type) {
    var parser = new DOMParser();
    this.doc = parser.parseFromString(text, type || "text/html");

    this.walkSelector = function(selector, callback) {
        return this.walkNodes(this.querySelectorAll(selector), callback);
    };

    this.querySelector = function(selector) {
        return this.doc.querySelector(selector);
    };

    this.querySelectorAll = function(selector) {
        return this.doc.querySelectorAll(selector);
    };

    this.walkNodes = function(nodes, callback) {
        return Array.prototype.map.call(nodes, callback);
    };
    return this;
};

/**
 * Fetch active 'mantis' ticket.
 * Doesn't work with a proper promise unfortunately due to a new chrome bug. yay.
 */
var getActiveTicket = function(cb) {
    chrome.tabs.query({}, function(tabs) {
        var activeTab = tabs.filter(function(tab) {
            return tab.selected == 1 && tab.url.indexOf('support.samson-it.nl') > -1;
        }).pop();
        if (activeTab) {
            cb(activeTab);
        }
    });
};

var getGitlabHistory = function(cb) {

    var request = new XMLHttpRequest();
    request.open("GET", 'http://gitlab.samson-it.local/dashboard.atom?private_token=AEoTiNuGBWCgiAbyL258', true);
    request.onreadystatechange = function(e) {
        if (request.readyState == 4 && request.status == 200) {
            var response = request.responseText;
            var scraper = new HTMLScraper(response, 'text/xml');
            var nodes = [];
            scraper.walkSelector("entry", function(item) {
                if (item.querySelector('author email').innerHTML == 'jelle@samson-it.nl') {
                    nodes.push(item.querySelector('summary blockquote').innerText);
                }
            });
            cb(nodes);
        }
    };
    request.send();
};



/** 
 * send a response back over the runtime.id channel
 */
function sendResponse(response) {
    console.log("Sending response via runtime.id!", response);

    chrome.runtime.sendMessage(chrome.runtime.id, response, function(r) {});

}


var injectorListener = function(request, sender, responder) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    console.log("request", request, sender);
    if (request.here_u_haz) {
        switch (request.here_u_haz) {
            case 'total_today':
                var time = request.total_today.match(/([0-9]{2})u ([0-9]{2})m/);
                if (time) {
                    time = time.slice(1).join(':');

                    if (time[0] == '0') time = time.substr(1);
                    chrome.browserAction.setBadgeText({
                        text: time
                    });
                    chrome.browserAction.setBadgeBackgroundColor({
                        color: [25, 25, 25, 150]
                    });
                }
                //"0d 08u 32m in 10 regels"
                break;
        }
    } else if (request.can_i_haz) {
        switch (request.can_i_haz) {
            case 'active_ticket':
                getActiveTicket(function(activeTab) {
                    console.info("Received active tab!", activeTab.title);
                    sendResponse({
                        here_u_haz: 'active_ticket',
                        ticket: activeTab.title
                    });
                });
                break;
            case 'gitlab_history':
                getGitlabHistory(function(history) {
                    sendResponse({
                        here_u_haz: 'gitlab_history',
                        history: history
                    });
                });
                break;
            default:
                console.error("Not understood!", request);
                break;
        }
    } else if (request.can_i) {
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
                    sendResponse({
                        you_can: 'style_for_tab'
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
                    sendResponse({
                        'you_can': 'pimp_tr'
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
    }
};

chrome.extension.onMessage.addListener(injectorListener);