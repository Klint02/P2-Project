const caller_marker = "http://maps.google.com/mapfiles/kml/shapes/man.png"
let object_to_change; //should be made non-global
let current_object;
let last_marker;

initECC();

/*Gets calls from the server and starts plotting, called when the "Next Call" button is pressed*/
function getCalls(mapname, path) {
    console.log("Next");
    let queue = 0;
    console.log("path" + path);
    /*Fetches callerDB file for the day*/
    fetch(path)
        .then(getCurrentEmergencies(mapname, path, emergency_marker, false))
        .then(response => response.json())
        .then(calls => {
            populateSideBar(calls);
            // Get the number of calls in queue
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered == false && calls[i].answering == false) {
                    queue++;
                }
            }
            // Check through all calls
            for (let i = 0; i < calls.length; i++) {
                if (queue === 0) {
                    // Creates HTML with information
                    alert("No calls in queue, a peaceful moment in Gotham");
                    break;
                    /*let call_text = document.getElementById('call_text');
                    call_text.innerHTML = `There is no calls in queue`;*/
                } else {
                    // Delete last person_marker
                    if (last_marker != undefined) {
                        delPerson(last_marker);
                    }
                    // If call is unanswered
                    if (calls[i].answered === false && calls[i].answering === false) {
                        // Checks if there is and address if not set address to the AML
                        let addressInput;
                        if (calls[i].location.address == "Unknown address") {
                            addressInput = String("(Unknown) AML - Lat: " + calls[i].AMLLocation.lat + " Lng: " + calls[i].AMLLocation.lng);
                        } else {
                            addressInput = calls[i].location.address;
                        }
                        // Get the first unanswered call
                        object_to_change = i;
                        // Creates HTML with information
                        let call_text = document.getElementById('call_text');
                        /*call_text.innerHTML = `Id: ${calls[i].id} <br>
                        Name: ${calls[i].name} <br>
                        Address: ${addressInput} <br>
                        Situation: ${calls[i].situation} <br>
                        Time: ${calls[i].timeset} <br>`;*/
                        document.getElementById("name").value = calls[i].name;
                        document.getElementById("situation").value = calls[i].situation;
                        document.getElementById("address").value = addressInput;
                        document.getElementById("injuries").value = calls[i].injuries;
                        document.getElementById("description").value = calls[i].description;


                        // Adds marker wher caller is calling from
                        current_object = calls[object_to_change];
                        marker = addCallerMarker(calls[object_to_change].AMLLocation, caller_marker, mapname);
                        map.setCenter(marker.getPosition());
                        map.setZoom(16);
                        last_marker = marker;
                        // Post data
                        fetch('/change_answering', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            body: `{"to_change": ${object_to_change}, "value": true}`,
                        });
                        i = calls.length;
                    }
                }
            }
        });
}

//Plots an emergency and send data to the server to change object variables. Called by "plot emergency" button
async function postData(mapname) {
    if (object_to_change === undefined) {
        // Creates HTML with information
        let call_text = document.getElementById('call_text');
        call_text.innerHTML = `You need to pick up a call first`;
    } else {//else  if we know what object to change:
        fetch(path)
            .then(response => response.json())
            .then(calls => {
                createMarker(calls[object_to_change], emergency_marker, map, last_marker, object_to_change);
                // Creates HTML with information
                let call_text = document.getElementById('call_text');
                call_text.style.marginLeft = "10px";
                call_text.innerHTML = `Pick up a new call`;
            });
        // Post data
        delPerson(last_marker);
        fetch('/emergency_accepted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: `{"to_change": ${object_to_change}, "value": true}`,
        });
    }

}

//Starts the process of adding links between the current call and the clicked call
function link(id, sidebar) {
    object_to_change = undefined;
    //Remove popup. This is NOT the proper way to do it, hence why it is in a try catch
    try {
        document.querySelectorAll(".gm-style-iw")[0].remove();
    } catch {
        console.log("Couldn't autoremove prompt");
    }
    //current_object is only populated  
    if (current_object == undefined) {
        alert("Start a call to link it")
    } else {
        sidebar = false;
        if (!sidebar) delPerson(last_marker);
        for (let i = 0; i < current_object.links.length; i++) {
            if (current_object.links[i] == id) {
                return;
            }
        }
        current_object.links.push(id)
        fetch('/add_link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: `{"objID": \"${id}\", "curentObjID" : \"${current_object.id}\"}`,
        }).then(() => {
            //clearForm();
            getCurrentEmergencies(map, path, emergency_marker, true);
        });
    }
}

//If a uuid is found remove the login screen and replace with a login success thingy
//and a logout button that expires the cookie
/*For the if statement, was changed because it now doesn't work: document.cookie != "uuid="*/
function initECC() {
    if (document.cookie != "") {
        document.getElementById("loginForm").remove();
        //document.getElementById("loginText").innerText = "Logged in";
        document.getElementById("logoutPlaceholder").innerHTML = '<button id=logoutbtn  class="btn btn-secondary btn-block">Logout</button>';

        let buttonsPlaceholder = document.getElementById("buttonsPlaceholder");
        buttonsPlaceholder.innerHTML = '<div id="calls"><button id="new_call" class="btn btn-primary btn-block">Next call</button>';
        /*<button id="emergency_handled" class="btn btn-primary btn-block">Plot emergency</button>';*/
        //Add events to the newly played buttons
        document.getElementById("logoutbtn").addEventListener("click", function (event) {
            location.href = "ecc.html";
            document.cookie = "uuid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        });
        document.querySelector('#new_call').addEventListener('click', function (event) {
            event.preventDefault();
            getCalls(map, path);
        });
        /*document.querySelector('#emergency_handled').addEventListener('click', function (event) {
            event.preventDefault();
            //console.log(event);
            postData(map);
        });*/
    } else {
        //If a cookie exists and is not "" the user is considered logged in otherwise we add the login
        //button and setup the event
        document.querySelector('#loginForm').addEventListener('submit', function (event) {
            event.preventDefault();
            //creates an object with logindata
            const data = new FormData(event.target);
            const obj = {
                uname: data.get("uname"),
                psw: data.get("psw")
            }
            //Sends logindata for checking on the serverside. If a login is successfull a cookie
            //is returned
            fetch('/Pages/ECC/ecc.html', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(obj),
            }).then(() => {
                //reloads the page
                location.reload();
            });
        });
    }
}

document.querySelector('#eccForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const obj = {
        id: current_object.id,
        name: data.get('name'),
        situation: data.get('situation'),
        address: data.get('address'),
        injuries: data.get('injuries'),
        description: data.get('description')
    }
    if (!obj.address.search('/([0-9]{4})/')) {
        obj.address += ", 9000";
    }

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
        }).catch(err => {
            console.log(err);
        });
});

function createMarker(call, emergency_marker, mapname, last_marker, object_to_change) {
    let addressInput;
    if (call.location.address == "Unknown address") {
        addressInput = String("(Unknown) AML - Lat: " + call.AMLLocation.lat + " Lng: " + call.AMLLocation.lng);
    } else {
        addressInput = call.location.address;
    }
    // Information to display in box
    let info_to_display =
        `Id: ${call.id},
        <br>Name: ${call.name},
        <br>Tlf: ${call.number},
        <br>Address: ${addressInput},
        <br>Time: ${call.timeset},
        <br>Description: ${call.description}`;
    // Checks if address is provided or if there is need of use of only AML lat:lng for place of emergency
    if (call.location.address == "Unknown address") {
        addMarker(String(call.situation), call.AMLLocation, emergency_marker, mapname, info_to_display, call.id);
        object_to_change = undefined; //dont let me plot the emergency more than once
    } else if (call.AMLLocation.address != "Unknown address") {
        addMarker(String(call.situation), call.location, emergency_marker, mapname, info_to_display, call.id);
        object_to_change = undefined;//dont let me plot the emergency more than once
    }
    delPerson(last_marker);
    clearForm();
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('situation').value = '';
    document.getElementById('address').value = '';
    document.getElementById('injuries').value = '';
    document.getElementById('description').value = '';
}