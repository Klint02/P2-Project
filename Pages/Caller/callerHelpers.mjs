function addGeoMarker(address) {
    return new Promise((resolve, reject) => {
        let latlngObj;
        // Creates new geocoder which allows us to convert a standard adress to LAT and LNG
        let geocoder = new google.maps.Geocoder();
        // geocode is an api, which Converts the "standard" address to LAT and LNG
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latlngObj = {
                    lat: ((results[0].geometry.location.lat())),
                    lng: ((results[0].geometry.location.lng()))
                }
                resolve(latlngObj);
            } else {
                alert('Geocode was not successful for the following reason: ' + status + ' and will therefore change the given address to "unknown address"');
                reject("Unknown address");
            }
        });
    });
}

// Creates a POST request with the caller object
// Used for caller queue and other
// Stored in ServerData/CallerDB/
// sendJSON
async function sendJSON(caller) {
    let response = await fetch('/callerobj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: caller,
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}
