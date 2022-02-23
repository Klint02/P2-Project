function initMap() {
    // The location of Uluru
    const toby = { lat: 57.02459288026477, lng: 9.944473552234317 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: toby,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: toby,
        map: map,
    });
}

