let map;

//The nodefault class removes the default behavior from any event
try {
    document.querySelector(".nodefault").addEventListener("click", function (event) {
        event.preventDefault();
    });
} catch {
    console.log("No \"no Defaults\"")
}

//TODO: we have an offical uuid generator "uuidv4()"
//Generates a unique identifyer
function makeUniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

//Gets the emergencies that are considered current and reloads the map
function getCurrentEmergencies(mapname, path, emergency_marker, update) {
    clearAllMarkers();
    //Fethes the callerDB for that day if called correctly !!
    fetch(path)
        .then(response => response.json())
        .catch(err => { console.warn("Possibly non-existing caller file: " + err) })
        .then(calls => {
            if (calls == undefined) return 1;
            let links = [];
            let extraIndex = 0;
            //Goes through ALL emergencies current or not
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered === true && calls[i].active === true && calls[i].answering === true) {
                    //Everything in this scope is considered current
                    //Adds links between markers
                    addLinks(calls[i], calls, links, update);
                    //used for skipping an extra fetch to the server for adding the latest call in the sidebar
                    extraIndex = i;
                    // Information to display in box
                    let addressInput;
                    //If a proper location is available it will be used, otherwise AML location will be used
                    if (calls[i].location.address == "Unknown address") {
                        addressInput = String("(Unknown) AML - Lat: " + calls[i].AMLLocation.lat + " Lng: " + calls[i].AMLLocation.lng);
                    } else {
                        addressInput = calls[i].location.address;
                    }
                    //Generates the info shown in the popup on the markers
                    let info_to_display = `Id: ${calls[i].id},
                    <br>Navn: ${calls[i].name},
                    <br>Tlf: ${calls[i].number},
                    <br>Addresse: ${addressInput},
                    <br>Time: ${calls[i].timeset},
                    <br>Description: ${calls[i].description}`;
                    //addmarker called with either aml location or proper location
                    if (calls[i].location.address == "Unknown address") {
                        addMarker(calls[i].situation, calls[i].AMLLocation, emergency_marker, mapname, info_to_display, calls[i].id);
                    } else if (calls[i].location.address != "Unknown address") {
                        addMarker(calls[i].situation, calls[i].location, emergency_marker, mapname, info_to_display, calls[i].id);
                    }
                }
            }
            //Populates the side bar
            populateSideBar(calls);
        });
}

//Adds links between markers
function addLinks(obj, calls, links, update) {
    //Goes through link in the passed object
    for (let i = 0; i < obj.links.length; i++) {
        //Goes through all objects
        for (let p = 0; p < calls.length; p++) {
            //If an object in the calls array has the same id as one of the passed object's links
            //A link will be created between them
            if (obj.links[i] == calls[p].id && ((obj.active && calls[p].active) || update)) {
                let addressOne;
                let addressTwo;
                //Just for handling aml vs proper location
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
                        lng: obj.location.lng
                    }
                } else {
                    addressTwo = {
                        lat: obj.AMLLocation.lat,
                        lng: obj.AMLLocation.lng
                    }
                }
                //For avoiding adding a line twice in both directions
                const tempObjsFordupCheck = { addressTwo, addressOne }
                if (links.specialContains(tempObjsFordupCheck)) {
                    console.log("dupe");
                    return;
                }
                links.push({ addressOne, addressTwo });

                //Creates a Polyline that can then be added to the map
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

/*Checks if array of latlngObj have the same location as a latlngObj*/
Array.prototype.specialContains = function (input) {
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