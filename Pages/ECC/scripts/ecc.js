let emergency_marker = "http://maps.google.com/mapfiles/kml/shapes/caution.png"
let caller_marker = "http://maps.google.com/mapfiles/kml/shapes/man.png"
let d = new Date()
let path = "../../Server/ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
let markersArray = []; //Can be made non-global
let caller_markers = {}; //should be made non-global
let object_to_change; //should be made non-global
let markerID; //MUST be made non-global

function getCalls(mapname) {
    console.log("hello");
    let queue = 0;
    fetch(path)
        .then(clearAllMarkers()) // clears all markers in the client-side array
        .then(getCurrentEmergencies(mapname))
        .then(response => response.json())
        .then(calls => {
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
                    let call_text = document.getElementById('call_text');
                    call_text.innerHTML = `Der er ikke flere opkald`;
                } else {
                    // If call is unanswered
                    if (calls[i].answered === false && calls[i].answering === false) {
                        // Get the first unanswered call
                        object_to_change = i;
                        // Creates HTML with information
                        let call_text = document.getElementById('call_text');
                        call_text.innerHTML = `Id: ${calls[i].id} <br>
                        Navn: ${calls[i].name} <br>
                        Addresse: ${calls[i].location.address} <br>
                        Situation: ${calls[i].situation} <br>
                        Tidspunkt: ${calls[i].timeset} <br>`;

                        // Adds marker wher caller is calling from
                        markerID = addCallerMarker(calls[object_to_change].AMLLocation, caller_marker, mapname);

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

async function postData(mapname) {
    if (object_to_change === undefined) {
        // Creates HTML with information
        let call_text = document.getElementById('call_text');
        call_text.innerHTML = `Du skal først tage et opkald`;
    } else {
        fetch(path)
            .then(response => response.json())
            .then(calls => {
                // Information to display in box
                let info_to_display = `Id: ${calls[object_to_change].id} <br>Navn: ${calls[object_to_change].name}<br>Tlf: ${calls[object_to_change].number}<br>Addresse: ${calls[object_to_change].location.address}<br>Time: ${calls[object_to_change].timeset}<br>Description: ${calls[object_to_change].description}`;
                // Checks if address is provided or if there is need of use of only lat:lng for place of emergency
                if (calls[object_to_change].location.address == "Unknown address") {
                    addMarker(String(calls[object_to_change].situation), calls[object_to_change].AMLLocation, emergency_marker, mapname, info_to_display, calls[object_to_change].id);
                    object_to_change = undefined; //dont let me plot the emergency more than once
                } else if (calls[object_to_change].AMLLocation.address != "Unknown address") {
                    console.log("Before: ", calls[object_to_change].situation);
                    addMarker(String(calls[object_to_change].situation), calls[object_to_change].location, emergency_marker, mapname, info_to_display, calls[object_to_change].id);
                    //addGeoMarker(String(calls[object_to_change].situation), calls[object_to_change].location.address, mapname, info_to_display, calls[object_to_change].id);
                    object_to_change = undefined;//dont let me plot the emergency more than once
                }

                // Creates HTML with information
                let call_text = document.getElementById('call_text');
                call_text.innerHTML = `Tag næste opkald`;

            });
        // Post data
        delPerson(markerID);
        fetch('/emergency_accepted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: `{"to_change": ${object_to_change}, "value": true}`,
        });
    }

}

//If a uuid is found remove the login screen and replace with a login success thingy
//and a logout button that expires the cookie
/*For the if statement, was changed because it now doesn't work: document.cookie != "uuid="*/
if (document.cookie != "") {
    document.getElementById("loginForm").remove();
    //document.getElementById("loginText").innerText = "Logged in";
    let loginPlaceholder = document.getElementById("logoutPlaceholder");
    //loginPlaceholder.style.display = "inline-block";
    loginPlaceholder.innerHTML = '<div id="calls"><button id="new_call">Næste opkald</button><button id="emergency_handled">Plot emergency</button><p id="call_text"></p></div><p>Logged in</p><button id=logoutbtn>Logout</button>';
    document.getElementById("logoutbtn").addEventListener("click", function (event) {
        location.href = "ecc.html";
        document.cookie = "uuid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    });
    document.querySelector('#new_call').addEventListener('click', function (event) {
        event.preventDefault();
        getCalls(map);
    });
    document.querySelector('#emergency_handled').addEventListener('click', function (event) {
        event.preventDefault();
        postData(map);
    });
}