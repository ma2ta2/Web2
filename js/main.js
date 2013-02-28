/*main.jsのサンプル*/
function changeName(){
var changename = document.getElementById("kanban");
changename.innerHTML = "CHANGE";
alert("書き換えたよ!");
}

function geoLocate(){
 if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        callback(position.coords.latitude, position.coords.longitude);
    });
} else {
  alert("お使いのブラウザでは現在位置情報が取得できません。");
}
}

function callback(lat, lon) {
    var geocode = "緯度" + lat + " 経度"+lon;
    alert(geocode);
}

