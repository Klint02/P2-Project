let emergency_marker = "http://maps.google.com/mapfiles/kml/shapes/caution.png"
let caller_marker = "http://maps.google.com/mapfiles/kml/shapes/man.png"
let d = new Date()
let path = "../../ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
let markers = [];
let map;

function uniqueID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function initMap() {
    const markers = [
        { lat: 57.05270767455275, lng: 9.913094102327587 },
        { lat: 57.012554751715186, lng: 9.991338053228736 },
        { lat: 57.01750002653716, lng: 9.972801777699798 },
        { lat: 57.017410295776145, lng: 9.972801777699798 }
    ]

    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: markers[2],
    });

    get_current_emergencies(map);
    //input name of the file and the name of the map you want the marker plottet on
    //readfile_and_plot('report', map);//reads a file, centers the map on the address found in the file and plots a marker.
    // mapMarkers = [];

    // for (let i = 0; i < markers.length; i++) {
    //     new google.maps.Marker({
    //         position: markers[i],
    //         map: map,
    //     });
    // }
}

function get_current_emergencies(mapname) {
    fetch(path)
        .then(response => response.json())
        .then(calls => {
            for (let i = 0; i < calls.length; i++) {
                if (calls[i].answered === true & calls[i].active === true) {
                    console.log(calls[i].name);
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

let object_to_change;

function get_calls(mapname) {
    let queue = 0;
    fetch(path)
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
                        //console.log(calls[i].id);
                        object_to_change = i;
                        // Creates HTML with information
                        let call_text = document.getElementById('call_text');
                        call_text.innerHTML = `Id: ${calls[i].id} <br>
                        Navn: ${calls[i].name} <br>
                        Addresse: ${calls[i].address} <br>
                        Situation: ${calls[i].whatIs} <br>
                        Tidspunkt: ${calls[i].whenIs} <br>`;
                        
                        // Adds marker wher caller is calling from
                        add_caller_marker(calls[object_to_change].AMLLocation, caller_marker, mapname);


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
                } else if (calls[object_to_change].address != "Unknown address") {
                    add_geo_marker(String(calls[object_to_change].situation), calls[object_to_change].address, mapname, info_to_display, calls[object_to_change].id);
                }
                
                // Creates HTML with information
                let call_text = document.getElementById('call_text');
                call_text.innerHTML = `Tag næste opkald`;

            });
        // Post data
        fetch('/emergency_accepted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: `{"to_change": ${object_to_change}, "value": true}`,
        });
    }

}

function find_address(search_text) {
    //let addressRegex = /([a-zA-Z]+ )+[0-9/a-zA-Z*/\,]+ [A-Z]\w+ [0-9]\w*/g;
    ///[[a-zA-Z]+: [+-]?[0-9]+\.?[0-9]*|\.[0-9]+, [a-zA-Z]+: [[+-]?[0-9]+\.?[0-9]*|\.[0-9]+]|([a-zA-Z]+ )+[0-9a-zA-Z*\,]+ [A-Z]\w+ [0-9]\w*/g

    //creates a match format we can compare against:
    //                  lat: || lng:  *decimal numbers*         OR        adress   +     numbers or address------------|
    let addressRegex = /[lat|lng]+: [+-]?[0-9]+\.?[0-9]*|\.[0-9]|([a-zA-Z]+ )+[0-9a-zA-Z*\,]+ [A-Z]\w+ [0-9]\w*/g
    let found_address = [];


    //matches the contents of search_text  with the file format addressRegex.
    found_address = search_text.match(addressRegex); // found_address = the full address, either as text or long/lat

    // If the length of the adress array is 2 ()
    if (found_address.length == 2) {
        let lat_output = Number(found_address[0].split(" ")[1]);
        let lng_output = Number(found_address[1].split(" ")[1]);
        let latlng_output = { lat: lat_output, lng: lng_output };

        return latlng_output;
    } else {
        return found_address.toString();
    }
}

function readfile_and_plot(filename, mapname) {
    fetch(filename + '.txt') // opens a file with name: "filename.txt"
        .then(response => response.text()) //returns the promise as a string (text)
        .then(report_info => {  // after the promise:
            // Do something with your data (report_info = content of 'filename.txt')
            //report_info = reportsemantics(report_info)
            let popup_header = report_info.split(/\n|: /)[1].toUpperCase();//searches for the first linebreak or ":"
            let report_info_to_display = reportsemantics(report_info); // set it to a string so it doesn't parse as undefined



            // Finds the address in the file input
            var address = find_address(report_info);

            plopmarker(address, popup_header, mapname, report_info_to_display);
        });
}
// Adds linebreaks to the loaded report string. without it, the popup displays the info in one long string with no <br> or \n
function reportsemantics(reportstring) {
    let split_report_info = reportstring.split('\n'); // Splits the string when there is a new line
    let report_info_to_display = ""; // set it to a string so it doesn't parse as undefined

    // Take the split data and add a <br> to every end so HTML makes a new line
    for (let i = 0; i < split_report_info.length; i++) {
        report_info_to_display += split_report_info[i] + "<br>";
    }
    /* TODO: decide foreach or for?
    split_report_info.forEach(element => {
        report_info_to_display += element + "<br>";
    });
    */
    return report_info_to_display;

}
function plopmarker(address, popup_header, mapname, report_info_to_display) {
    // If the data in address is a string (a normal address, example: Tagens vej 12)
    if (typeof address === 'string' || address instanceof String) {
        add_geo_marker(popup_header, address, mapname, report_info_to_display);
        // If the data in address is anything else - in our case an object ( { lat: 0000, lng: 0000 } )
    } else {
        // Centers the map to the location of the address
        mapname.setCenter(address);
        // Adds marker at the address
        addmarker(popup_header, address, emergency_marker, mapname, report_info_to_display);
    };
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
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
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
    google.maps.event.addListener(marker, "rightclick", function (point) {delMarker(marker)});
};

var delMarker = function (marker) {
    if (confirm('are you sure you want to delete the marker?') == true) {
        marker.setMap(null);
        let markerID = String(marker.id);
        fetch('/emergency_handled', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: `{"to_change": "${markerID}", "value": false}`,
        });
    }
    
}


function add_caller_marker(LngLat, markertype, mapname) {
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
        position: LngLat //results of .this = geocoder.geocode function
    });
    const infowindow = new google.maps.InfoWindow()
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(`<h1 id="firstHeading" class="firstHeading">Current caller</h1>`);
        infowindow.open(mapname, marker);
    });
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

            console.log(results[0].geometry.location.lat());
            console.log(results[0].geometry.location.lng());
            addmarker(popup_header, results[0].geometry.location, emergency_marker, mapname, report_info, uniqueID);
            // If the address is invalid or any other error
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

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

document.querySelector(".nodefault").addEventListener("click", function (event) {
    event.preventDefault();
});