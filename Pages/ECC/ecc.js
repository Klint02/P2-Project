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
    
    const marker = new google.maps.Marker({
        position: toby,
        map: map,
    });
}

