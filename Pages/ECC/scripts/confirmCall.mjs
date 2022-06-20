/*Handles the form*/
document.querySelector('#eccForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    /*Make object for sending to server*/
    let obj = {
        name: data.get('name'),
        situation: data.get('situation'),
        location: {
            address: data.get('address'),
            lat: "",
            lng: ""
        },
        injuries: data.get('injuries'),
        description: data.get('description')
    }

    if (current_object == undefined) {
        obj.id = makeUniqueID();
    } else {
        obj.id = current_object.id;
    }
    if (validator(obj)) {
        alert("Data not valid");
        return 1;
    }
    document.getElementById("address").placeholder = "";

    if (obj.location.address == "") {
        obj.location.address = "Unknown address";
        sendData(obj);
    } else {
        if (obj.location.address.search("([0-9]{4})") == -1) {
            obj.location.address += ", 9000 Aalborg";
        }
        addGeoMarker(obj.location.address)
            .then(latLngObj => {
                if (latLngObj == "Unknown address") return 1;
                obj.location.lat = latLngObj.lat;
                obj.location.lng = latLngObj.lng;
                sendData(obj);
            })
            .catch(err => {
                console.log(err);
            });
    }
});

function sendData(obj) {
    /*Send object to server*/
    fetch('/Pages/ECC/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(call => {
            populateSideBar(undefined, call);
            createMarker(call, emergency_marker, map, last_marker, object_to_change)
            //reloads the page
            //location.reload();
        })
        .catch(err => {
            console.log(err);
        });
}


/*Clears confirm form*/
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('address').placeholder = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}

/*Validator for validating form input are correct*/
function validator(obj) {
    if (obj.name == "") return 1;
    if (document.getElementById('address').placeholder == "" && obj.location.address == "") return 1;
    return 0;
}