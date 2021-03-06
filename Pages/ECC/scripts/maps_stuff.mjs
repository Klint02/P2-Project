let d = new Date();
let markersArray = []; //Can be made non-global
let path = "../../Server/ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";

//input the marker name so we can add more info to the marker and add an event listener later
function addMarker(popup_header, LngLat, markertype, mapname, report_info, uniqueID) {
    const infowindow = new google.maps.InfoWindow();
    //dont yet know how to add custom markers, but insert here
    const temp = {
        lat: LngLat.lat,
        lng: LngLat.lng
    }
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
        id: uniqueID,
        position: temp //results of .this = geocoder.geocode function
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
        <button onclick="link(\'${marker.id}\', true)">Link to current call</button>
        </div>
        </div>`);
        infowindow.open(mapname, marker);
    });
    google.maps.event.addListener(marker, "rightclick", function (point) {//adds the confirmDelMarker function to right clicks on the marker
        confirmDelMarker(marker)
    });

    markersArray.push(marker);
    //setTimeout(delMarker(marker), 9000);
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

function addCallerMarker(LngLat, markertype, mapname) {
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
        id: makeUniqueID(),
        position: LngLat //results of .this = geocoder.geocode function
    });
    const infowindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(`<h1 id="firstHeading" class="firstHeading">Current caller</h1>`);
        infowindow.open(mapname, marker);
    });
    //caller_markers[marker.id] = marker;
    return marker/*.id*/;
}

//Deletes a person marker
function delPerson(markerID) {
    markerID.setMap(null);
}

//Deletes all markers
function clearAllMarkers() {
    for (var i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray.length = 0;
}