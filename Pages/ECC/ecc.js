function initMap() {
    const markers = [
        { lat: 57.05270767455275, lng: 9.913094102327587 },
        { lat: 57.012554751715186, lng: 9.991338053228736 },
        { lat: 57.01750002653716, lng: 9.972801777699798 },
        { lat: 57.017410295776145, lng: 9.972801777699798 }
    ]


    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: markers[2],
    });
    
    mapMarkers = [];

    for(let i = 0; i < markers.length; i++){
        new google.maps.Marker({
            position: markers[i],
            map: map,
        });
    }
}
if(document.cookie != ""){
    document.getElementById("loginForm").remove();
    document.getElementById("loginText").innerText = "Logged in";
    document.getElementById("logoutPlaceholder").innerHTML = "<button id=logoutbtn>Logout</button>";
}
document.getElementById("logoutbtn").addEventListener("click", function (event) {
    location.href = "ecc.html";
    document.cookie = "uuid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
});

class event{
    constructor(lat, lng, type, adInfo, operator){
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.adInfo = adInfo;
        this.operator = operator;
        //this.address =
    }
}