let emergency_marker = "http://maps.google.com/mapfiles/kml/shapes/caution.png"
let caller_marker = "http://maps.google.com/mapfiles/kml/shapes/man.png"

function initMap() {
    const markers = [
        { lat: 57.05270767455275, lng: 9.913094102327587 },
        { lat: 57.012554751715186, lng: 9.991338053228736 },
        { lat: 57.01750002653716, lng: 9.972801777699798 },
        { lat: 57.017410295776145, lng: 9.972801777699798 }
    ]

    // The location of Aalborghus Kollegium (address of tobias)
    const toby = { lat: 57.02459288026477, lng: 9.944473552234317 };


    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: markers[2],
    });

    // The marker, positioned at "toby"
    addmarker('Tobias', toby, caller_marker, map, 'Her bor Tobias');

    //input name of the file and the name of the map you want the marker plottet on
    readfile_and_plot('report', map);//reads a file, centers the map on the address found in the file and plots a marker.
    get_calls();
    // mapMarkers = [];

    // for (let i = 0; i < markers.length; i++) {
    //     new google.maps.Marker({
    //         position: markers[i],
    //         map: map,
    //     });
    // }
}

let new_call = document.getElementById("new_call")
let emergency_handled = document.getElementById("emergency_handled")

function get_calls() {
    fetch('calls.json')
        .then(response => response.json())
        .then(calls => {
            console.log(calls)
            // Check through all calls
            for (let i = 0; i < calls.length; i++) {
                // If call is unanswered
                if (calls[i].answered === false && calls[i].answering === false) {
                    // Get the first unanswered call
                    console.log(calls[i].id);
                    calls[i].answering = true;
                    // Creates HTML with information
                    let call_text = document.getElementById('call_text');
                    call_text.innerHTML = `Id: ${calls[i].id} <br>
                    Navn: ${calls[i].name} <br>
                    Addresse: ${calls[i].address} <br>
                    Situation: ${calls[i].whatIs} <br>
                    Tidspunkt: ${calls[i].whenIs} <br>`;

                    // Post data
                    fetch('/postest', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8'
                        },
                        body: `${calls[i].answering = true}`,
                    });

                    i = calls.length;
                }
            }
        })
}

async function post_data() {
    fetch('/postest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: "test",
    });
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
            console.log(report_info);
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
        console.log(i);
        console.log(report_info_to_display);
        report_info_to_display += split_report_info[i] + "<br>";
    }
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
function addmarker(popup_header, LngLat, markertype, mapname, report_info) {
    const infowindow = new google.maps.InfoWindow();
    //dont yet know how to add custom markers, but insert here
    var marker = new google.maps.Marker({
        map: mapname,
        icon: markertype,
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

};

function add_geo_marker(popup_header, address, mapname, report_info) {
    // Creates new geocoder which allows us to convert a standard adress to LAT and LNG
    let geocoder = new google.maps.Geocoder();
    // geocode is an api, which Converts the "standard" address to LAT and LNG
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // Centers the map to the location of the address
            mapname.setCenter(results[0].geometry.location);
            // Inserts marker on the LAT and LNG of the adress
            addmarker(popup_header, results[0].geometry.location, emergency_marker, mapname, report_info);
            // If the address is invalid or any other error
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });

}

//If a uuid is found remove the login screen and replace with a login success thingy
//and a logout button that expires the cookie
if (document.cookie != "uuid=") {
    document.getElementById("loginForm").remove();
    //document.getElementById("loginText").innerText = "Logged in";
    let loginPlaceholder = document.getElementById("logoutPlaceholder");
    //loginPlaceholder.style.display = "inline-block";
    loginPlaceholder.innerHTML = '<p>Logged in</p><button id=logoutbtn>Logout</button>';
    document.getElementById("logoutbtn").addEventListener("click", function (event) {
        location.href = "ecc.html";
        document.cookie = "uuid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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

