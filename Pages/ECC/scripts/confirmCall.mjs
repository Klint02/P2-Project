/*Handles the form*/
document.querySelector('#eccForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    /*Make object for sending to server*/
    let obj = {
        name: data.get('name'),
        situation: data.get('situation'),
        address: data.get('address'),
        injuries: data.get('injuries'),
        description: data.get('description')
    }

    if (current_object == undefined) {
        obj.id = makeUniqueID();
    } else {
        obj.id = current_object.id;
    }
    if (validator(obj)) alert("Data not valid");

    if (!obj.address.search('/([0-9]{4})/')) {
        obj.address += ", 9000 Aalborg";
    }

    /*Send object to server*/
    fetch('/Pages/ECC/confirm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .catch(err => { console.log(err) })
        .then(call => {
            populateSideBar(undefined, call);
            createMarker(call, emergency_marker, map, last_marker, object_to_change)
            //reloads the page
            //location.reload();
        }).catch(err => {
            console.log(err);
        });
});

/*Clears confirm form*/
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}

/*Validator for validating form input are correct*/
function validator(obj) {
    if (obj.name == "") return 1
    if (obj.address == "") return 1;
    return 0;
}