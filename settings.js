window.onload = function() {

    chrome.storage.local.get('pimp_always', function(val) {
        console.log("Received pimp_always: ", val);
        document.getElementById('checkme').checked = val.pimp_always;
    });

    document.getElementById('checkme').onclick = function() {
        chrome.storage.local.set({
            'pimp_always': this.checked
        }, function() {
            console.log("Setting saved.");
        });

    };


};