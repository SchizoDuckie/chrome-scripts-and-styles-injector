var d = document.createElement('link');
d.rel = 'stylesheet';
d.href = chrome.extension.getURL('select2.min.css');
d.onload = loadSelect2;
document.body.appendChild(d);

function loadSelect2() {
    var e = document.createElement('script');
    e.src = chrome.extension.getURL('select2.min.js');
    e.onload = function() {
        loadGo();
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(e);
}

function loadGo() {
    var f = document.createElement('script');
    f.src = chrome.extension.getURL('go.js');
    f.onload = function() {
        this.parentNode.removeChild(this);
    };
    document.body.appendChild(f);
}