console.log("injecting content listener.");

function style_tab() {
    var s = document.createElement('link');
    s.rel = "stylesheet";
    s.href = chrome.extension.getURL("pimp.css");
    document.body.appendChild(s);

    window.onunload = function() {
        window.close();
    };
}

function pimp_page() {

    var d = document.createElement('script');
    d.src = chrome.extension.getURL('select2.min.js');
    d.async = true;
    document.body.appendChild(d);
    d.onload = function() {
        var e = document.createElement('script');
        e.src = chrome.extension.getURL('pimp-tr.js');
        e.async = true;
        document.body.appendChild(e);
    };
}

function override_tahoma() {
    document.body.innerHTML += '<style>* { font-family: sans-serif !important; }</style>';
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    console.log("request", message, sender);

    if (message.you_can) {
        switch (message.you_can) {
            case 'pimp':
                console.info("I can pimp!");
                pimp_page();
                break;
            case 'style_for_tab':
                console.info("I can style!");
                style_tab();
                break;
            case 'override_tahoma':
                console.log("I can override tahoma!");
                override_tahoma();
                break;

            default:
                console.error("Say wut? ", message);
                break;
        }
    } else if (message.here_u_haz) {
        switch (message.here_u_haz) {
            case 'active_ticket':
                console.warn("Got active ticket!", message);
                var inputs = document.querySelectorAll('.arbeidOmschrijving');
                var input = inputs[inputs.length - 1];
                input.value = '#' + message.ticket.split(':')[0];
                input.focus();
                window.scrollTo(0, document.body.scrollHeight);
                break;
            default:
                console.error("Unhandled here u haz!", message);
                break;
        }
    } else {

        console.error("Unhandled message came in!", JSON.stringify(message));

    }
    sendResponse();
});


chrome.runtime.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
    can_i: 'pimp'
});

chrome.runtime.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
    can_i: 'style_for_tab'
});

chrome.runtime.sendMessage('gephjjdbcmmbnkdinjfhbjninhmbheeh', {
    can_i_haz: 'active_ticket'
});