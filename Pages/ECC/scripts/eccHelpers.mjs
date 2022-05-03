let map;

try {
    document.querySelector(".nodefault").addEventListener("click", function (event) {
        event.preventDefault();
    });
} catch {
    console.log("No \"no Defaults\"")
}

//TODO: we have an offical uuid generator "uuidv4()"
function makeUniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCurrentEmergencies(mapname, path, emergency_marker, update) {
    clearAllMarkers();
    fetch(path)
        .then(response => response.json())
        .then(calls => {
            let links = [];
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered === true && calls[i].active === true && calls[i].answering === true) {
                    addLinks(calls[i], calls, links, update);
                    // Information to display in box
                    let info_to_display = `Id: ${calls[i].id}  </br><button id="linkMe" onclick="link(\'${calls[i].id}\')">Link current call</button><br>Navn: ${calls[i].name}<br>Tlf: ${calls[i].number}<br>Addresse: ${calls[i].address}<br>Time: ${calls[i].timeset}<br>Description: ${calls[i].description}`;
                    if (calls[i].location.address == "Unknown address") {
                        addMarker(calls[i].situation, calls[i].AMLLocation, emergency_marker, mapname, info_to_display, calls[i].id);
                    } else if (calls[i].location.address != "Unknown address") {
                        addMarker(calls[i].situation, calls[i].location, emergency_marker, mapname, info_to_display, calls[i].id);
                    }
                }
            }

        });
}

function addLinks(obj, calls, links, update) {
    for (let i = 0; i < obj.links.length; i++) {
        for (let p = 0; p < calls.length; p++) {
            if (obj.links[i] == calls[p].id && ((obj.active && calls[p].active) || update)) {
                let addressOne;
                let addressTwo;
                if (calls[p].location.address != "Unknown address") {
                    addressOne = {
                        lat: calls[p].location.lat,
                        lng: calls[p].location.lng
                    }
                } else {
                    addressOne = {
                        lat: calls[p].AMLLocation.lat,
                        lng: calls[p].AMLLocation.lng
                    }
                }
                if (obj.location.address != "Unknown address") {
                    addressTwo = {
                        lat: obj.location.lat,
                        lng: obj.location.lng,
                    }
                } else {
                    addressTwo = {
                        lat: obj.AMLLocation.lat,
                        lng: obj.AMLLocation.lng
                    }
                }
                const tempObjsFordupCheck = { addressTwo, addressOne }
                if (links.contains(tempObjsFordupCheck)) {
                    console.log("dupe");
                    return;
                }
                links.push({ addressOne, addressTwo });
                const line = new google.maps.Polyline({
                    path: [addressOne, addressTwo],
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                line.setMap(map);
            }
        }
    }
}

Array.prototype.contains = function (input) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].addressOne.lat == input.addressOne.lat &&
            this[i].addressOne.lng == input.addressOne.lng &&
            this[i].addressTwo.lat == input.addressTwo.lat &&
            this[i].addressTwo.lng == input.addressTwo.lng) {
            return 1;
        }
    }
    return 0;
}