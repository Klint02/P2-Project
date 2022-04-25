let emergency_marker = "http://maps.google.com/mapfiles/kml/shapes/caution.png"
let caller_marker = "http://maps.google.com/mapfiles/kml/shapes/man.png"
let d = new Date()
let path = "../../Server/ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
let markers = [];
let map;
let markersArray = [];
let caller_markers = {};
let object_to_change;
let markerID;

function make_UniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function initMap() {
    const markers = [
        { lat: 57.05270767455275, lng: 9.913094102327587 },
        { lat: 57.012554751715186, lng: 9.991338053228736 },
        { lat: 57.01750002653716, lng: 9.972801777699798 },
        { lat: 57.017410295776145, lng: 9.972801777699798 }
    ]

    // The map, centered at Aalborg
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: markers[2],
    });

    get_current_emergencies(map);
}

function get_current_emergencies(mapname) {
    fetch(path)
        .then(response => response.json())
        .then(calls => {
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered === true && calls[i].active === true && calls[i].answering === true) {
                    // Information to display in box
                    let info_to_display = `Id: ${calls[i].id} <br>Navn: ${calls[i].name}<br>Tlf: ${calls[i].number}<br>Addresse: ${calls[i].address}<br>Time: ${calls[i].timeset}<br>Description: ${calls[i].description}`;
                    if (calls[i].address == "Unknown address") {
                        addmarker(calls[i].situation, calls[i].AMLLocation, emergency_marker, mapname, info_to_display, calls[i].id); //AMLLocation burde være adresslocation (long/lat for address)
                    } else if (calls[i].address != "Unknown address") {
                        add_geo_marker(calls[i].situation, calls[i].address, mapname, info_to_display, calls[i].id);
                    }
                }
            }
        });
}

function get_calls(mapname) {
    let queue = 0;
    fetch(path)
        .then(clearAllMarkers()) // clears all markers in the client-side array
        .then(get_current_emergencies(mapname))
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
                        markerID = add_caller_marker(calls[object_to_change].AMLLocation, caller_marker, mapname);

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
        })
}

async function post_data(mapname) {
    if (object_to_change === undefined) {
        // Creates HTML with information
        let call_text = document.getElementById('call_text');
        call_text.innerHTML = `Du skal først tage et opkald`;
    } else {
        fetch(path)
            .then(response => response.json())
            .then(calls => {
                // Information to display in box
                let info_to_display = `Id: ${calls[object_to_change].id} <br>Navn: ${calls[object_to_change].name}<br>Tlf: ${calls[object_to_change].number}<br>Addresse: ${calls[object_to_change].address}<br>Time: ${calls[object_to_change].timeset}<br>Description: ${calls[object_to_change].description}`;
                // Checks if address is provided or if there is need of use of only lat:lng for place of emergency
                if (calls[object_to_change].address == "Unknown address") {
                    addmarker(String(calls[object_to_change].situation), calls[object_to_change].AMLLocation, emergency_marker, mapname, calls[object_to_change].id);
                    object_to_change = undefined; //dont let me plot the emergency more than once
                } else if (calls[object_to_change].address != "Unknown address") {
                    add_geo_marker(String(calls[object_to_change].situation), calls[object_to_change].address, mapname, info_to_display, calls[object_to_change].id);
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

//input the marker name so we can add more info to the marker and add an event listener later
function addmarker(popup_header, LngLat, markertype, mapname, report_info, uniqueID) {
    const infowindow = new google.maps.InfoWindow();
    //dont yet know how to add custom markers, but insert here
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
        id: uniqueID,
        position: LngLat //results of .this = geocoder.geocode function
    });
    google.maps.event.addListener(marker, 'click', function () {   //adds the infowindow.open function to left-clicks on the marker
        infowindow.close(); // Close previously opened infowindow
        //the following string cant be moved, due to how G-maps api works. 
        infowindow.setContent(`<div id="content">
        <div id="siteNotice">
        </div>
        <h1 id="firstHeading" class="firstHeading">${popup_header}</h1>
        <div id="bodyContent">
        <p>${report_info}</p>
        </div>
        </div>`);
        infowindow.open(mapname, marker);
    });
    google.maps.event.addListener(marker, "rightclick", function (point) {//adds the confirmDelMarker function to right clicks on the marker
        
        confirmDelMarker(marker) 
    });
    markersArray.push(marker);
};

var confirmDelMarker = function (marker) {//deletes the desired marker after user confirmation
    if (confirm('are you sure you want to delete the marker?') == true) {//opens a warning box at top of screen. "if confirmed by user"-> run delMarker
        delMarker(marker);
    }
}

function delMarker(marker) { //deletes the desired marker with no warning
    marker.setMap(null); //removes the marker from the current users map
    let markerID = String(marker.id);
    fetch('/emergency_handled', {  //changes the related call's "active" status in callers.js to false
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: `{"to_change": "${markerID}", "value": false}`,//this means that the emergency wont be plottet when all plots are refreshed
    });
}

function add_caller_marker(LngLat, markertype, mapname) {
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
        id: make_UniqueID(),
        position: LngLat //results of .this = geocoder.geocode function
    });
    const infowindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(`<h1 id="firstHeading" class="firstHeading">Current caller</h1>`);
        infowindow.open(mapname, marker);
    });
    caller_markers[marker.id] = marker;
    return marker.id;
}

function delPerson(markerid){
    let find_specefic_marker;
    for (var i in caller_markers) {
        if (i == markerid) {
            find_specefic_marker = caller_markers[i];
        }
    }
    find_specefic_marker.setMap(null);
}

function add_geo_marker(popup_header, address, mapname, report_info, uniqueID) {
    // Creates new geocoder which allows us to convert a standard adress to LAT and LNG
    let geocoder = new google.maps.Geocoder();
    // geocode is an api, which Converts the "standard" address to LAT and LNG
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Centers the map to the location of the address
            mapname.setCenter(results[0].geometry.location);
            // Inserts marker on the LAT and LNG of the adress
            addmarker(popup_header, results[0].geometry.location, emergency_marker, mapname, report_info, uniqueID);
            // If the address is invalid or any other error
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function clearAllMarkers() {
    for (var i = 0; i < markersArray.length; i++ ) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
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
        get_calls(map);
    });
    document.querySelector('#emergency_handled').addEventListener('click', function (event) {
        event.preventDefault();
        post_data(map);
    });
}

class event {
    constructor(lat, lng, type, adInfo, operator) {
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.adInfo = adInfo;
        this.operator = operator;
        //this.address =
    }
}
try {
    document.querySelector(".nodefault").addEventListener("click", function (event) {
        event.preventDefault();
    });
} catch {
    console.log("No \"no Defaults\"")
}

