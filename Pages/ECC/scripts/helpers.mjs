

try {
    document.querySelector(".nodefault").addEventListener("click", function (event) {
        event.preventDefault();
    });
} catch {
    console.log("No \"no Defaults\"")
}

function makeUniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCurrentEmergencies(mapname, path, emergency_marker) {
    fetch(path)
        .then(response => response.json())
        .then(calls => {
            console.log(calls);
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered === true && calls[i].active === true && calls[i].answering === true) {
                    // Information to display in box
                    let info_to_display = `Id: ${calls[i].id} <br>Navn: ${calls[i].name}<br>Tlf: ${calls[i].number}<br>Addresse: ${calls[i].address}<br>Time: ${calls[i].timeset}<br>Description: ${calls[i].description}`;
                    if (calls[i].location.address == "Unknown address") {
                        addMarker(calls[i].situation, calls[i].AMLLocation, emergency_marker, mapname, info_to_display, calls[i].id);
                    } else if (calls[i].location.address != "Unknown address") {
                        addMarker(calls[i].situation, calls[i].location, emergency_marker, mapname, info_to_display, calls[i].id);
                    }
                }
            }
        });
}