//Returns a promise that tries to get a latlngObj from an address
function addGeoMarker(address) {
    return new Promise((resolve, reject) => {
        let latlngObj;
        // Creates new geocoder which allows us to convert a standard adress to LAT and LNG
        let geocoder = new google.maps.Geocoder();
        // geocode is an api, which Converts the "standard" address to LAT and LNG
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK && results[0].partial_match != true) {
                latlngObj = {
                    lat: ((results[0].geometry.location.lat())),
                    lng: ((results[0].geometry.location.lng()))
                }
                resolve(latlngObj);
            } else {
                if (results[0].partial_match === true) {
                    alert("Google maps only found a partial match which is forbidden");
                } else {
                    alert("Address given was invalid, please enter a new address");
                }
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

//Clears the main form
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}
