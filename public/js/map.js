// https://www.synbioz.com/blog/tech/carte-france-svg
document.addEventListener('DOMContentLoaded', function () {
    map = this.getElementById('map');
    paths = map.getElementsByTagName('path');

    for (var i = 0; i < paths.length; i++) {
        paths[i].addEventListener("click", function (e) {
            console.log("Dpt: " + e.target.getAttribute('data-num'));
        })
    }

});