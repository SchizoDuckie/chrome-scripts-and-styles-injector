if (!localStorage.getItem('pimp_always')) {
    localStorage.setItem('pimp_always', 1);
}
if (!localStorage.getItem('tahoma')) {
    localStorage.setItem('tahoma', 1);
}
window.onload = function() {

    document.getElementById('checkme').checked = localStorage.getItem('pimp_always') == '1';
    document.getElementById('tahoma').checked = localStorage.getItem('tahoma') == '1';


    document.getElementById('checkme').onclick = function() {
        localStorage.setItem('pimp_always', this.checked ? '1' : '0');
    };

    document.getElementById('tahoma').onclick = function() {
        localStorage.setItem('tahoma', this.checked ? 1 : 0);
    };


};