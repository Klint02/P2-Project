const emergency_marker = "http://maps.google.com/mapfiles/kml/shapes/caution.png"
function initMap() {
    const defaultCenter = { lat: 57.012554751715186, lng: 9.991338053228736 };

    // The map, centered at Aalborg
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultCenter,
    });

    getCurrentEmergencies(map, path, emergency_marker, false);
}