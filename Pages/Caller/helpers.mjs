function add_geo_marker(address) {
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
                alert('Geocode was not successful for the following reason: ' + status);
                reject("Unknown address");
            }
        });
    });
}

// Listens to when a form is submitted, and runs the handlesubmit function
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    handle_submit(event);
});

// Creates a POST request with the caller object
// Used for caller queue and other
// Stored in ServerData/CallerDB/
// sendJSON
async function send_JSON(caller) {
    let response = await fetch('/callerobj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: caller,
    });
}

function clear_form() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}