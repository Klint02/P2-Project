// caller.js v1.0
// FUNCTIONALITY: Creates a caller object and sends it via a POST request to a server
// Created by Group A221a software semester 2 2022
// Responsible: Nicklas Christensen

// General test generator for callers
// implement form based test (DONE)
// implement RNG data (NOT DONE)

// PLACEHOLDER FUNCTION 
// NEEDED FOR GOOGLE MAPS LAT AND LONG
function add_geo_marker(address) { 
   return new Promise ((resolve, reject) => {
        let latlngArr = [];
        let latitude;
        let longitude;
        let latlngObj;
        // Creates new geocoder which allows us to convert a standard adress to LAT and LNG
        let geocoder = new google.maps.Geocoder();
        // geocode is an api, which Converts the "standard" address to LAT and LNG
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latlngArr[0] = (results[0].geometry.location.lat());
                latlngArr[1] = (results[0].geometry.location.lng());
                latitude = ((results[0].geometry.location.lat()));
                console.log(latitude);
                latlngObj = {
                    lat: ((results[0].geometry.location.lat())),
                    lng: ((results[0].geometry.location.lng()))    
                }
                console.log(latlngObj);
                resolve(latlngObj);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
                reject("Unknown address");
            }
        });
    });
}

// Takes info written in the caller.html form and assigns it to variables
// The variables are used to assign data to a caller
function handleSubmit(event) {
  const data = new FormData(event.target);

  const name = data.get('name');

  const situation = data.get('situation');

  const address = data.get('address');

  const injuries = data.get('injuries');

  const description = data.get('description');

  infoPlacer(name, situation, address, injuries, description);
}


// Listens to when a form is submitted, and runs the handlesubmit function
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit(event);
});


// Reads info from variables and determines whether there is a need for generating placeholders or not
function infoPlacer(name, situation, address, injuries, description) {
console.log("Hello")
  let addressArr = [{ lat: 57.017145, lng: 9.987593 }, { lat: 57.052578, lng: 9.911738 }, { lat: 57.046832, lng: 9.913825 }];
  let addressArrIndex, formZeroLen = 0, numberMAX = 99999999, numberMIN = 10000000;
  let locationObj;
  let tempNumber = Math.floor(Math.random() * numberMAX);
  let latlngObj;
  tempNumber < numberMIN ? number = tempNumber + 10000000 : number = tempNumber;
  let tempArr = ["idk", "id"];
  addressArrIndex = (Math.floor(Math.random() * addressArr.length));

  if (name.length === formZeroLen) {
    name = "unknown caller";
  }
  if (situation.length === formZeroLen) {
    situation = "unknown situation";
  }

  if (injuries.length === formZeroLen) {
    injuries = "unknown injuries";
  }

  if (description.length === formZeroLen) {
    description = "No description provided";
  }
  
  if (address.length === formZeroLen) {
    address = "Unknown address"
  } else {
    const fuckJS = add_geo_marker(address)
    fuckJS.then(latlngObj => {
        console.log(latlngObj,"test");
        infoPlacerResult(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex);
    }).catch(err => {
        console.log(err);
        infoPlacerResult(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex);
    });
    console.log("test");
  // Assigns the info values to an object

  clearForm();
}
}
// Creates a POST request with the caller object
// Used for caller queue and other
// Stored in ServerData/CallerDB/
async function sendJSON(caller) {
  let response = await fetch('/callerobj', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: caller,
  });
}

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('situation').value = '';
  document.getElementById('address').value = '';
  document.getElementById('injuries').value = '';
  document.getElementById('description').value = '';
}

function infoPlacerResult(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex) {
  let callObj = {
    name: name,
    location: locationObj = {
    address: address, 
    lat: address === "Unknown address" || typeof(latlngObj) == String ? "" : latlngObj.lat, 
    lng: address === "Unknown address" || typeof(latlngObj) == String ? "" : latlngObj.lng
    },
    situation: situation,
    number: number,
    timeset: new Date().toLocaleString("da-DK", { timeZone: "Europe/Copenhagen" }),
    AMLLocation: addressArr[addressArrIndex],
    injuries: injuries,
    answered: false,
    answering: false,
    useful: true,
    description: description
  }

  // Converts the object to a JSON string for the POST request
  let caller = JSON.stringify(callObj)
  sendJSON(caller);

}
