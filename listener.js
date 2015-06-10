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

function pimp_mantis() {
    var b = document.createElement('script');
    b.src = chrome.extension.getURL('jquery.min.js');
    b.async = true;
    b.onload = function() {
    var d = document.createElement('script');
    d.src = chrome.extension.getURL('select2.min.js');
    d.async = true;
    document.body.appendChild(d);
    d.onload = function() {
        var e = document.createElement('script');
        e.src = chrome.extension.getURL('pimp-mantis.js');
        e.async = true;
        document.body.appendChild(e);
    };
    }
    document.body.appendChild(b);
}


function override_tahoma() {
    document.body.innerHTML += '<style>* { font-family: sans-serif !important; }</style>';
}

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.you_can) {
        switch (message.you_can) {
            case 'pimp_tr':
                console.info("I can pimp!");
                pimp_page();
                break;
            case 'pimp_mantis':
                console.info("I can pimp le mantis!");
                pimp_mantis();
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
                input.value = '#' + message.ticket.split(':')[0].substring(-5)+'.';
                setTimeout(function() {
                    window.scrollTo(0, document.body.scrollHeight);
                },500);
                
                break;
            default:
                console.error("Unhandled here u haz!", message);
                break;
        }
    } else {
        //console.error("Unhandled message came in!", JSON.stringify(message));
    }
});


if(window.location.href.indexOf('tr.samson-it.nl') > -1 ) {
    chrome.runtime.sendMessage(chrome.runtime.id, {
        can_i: 'pimp_tr'
    });

    chrome.runtime.sendMessage(chrome.runtime.id, {
        can_i: 'style_for_tab'
    });

    chrome.runtime.sendMessage(chrome.runtime.id, {
        can_i_haz: 'active_ticket'
    });
} else {
    chrome.runtime.sendMessage(chrome.runtime.id, {
        can_i: 'pimp_mantis'
    });
}