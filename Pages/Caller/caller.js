// caller.js v1.0
// FUNCTIONALITY: Creates a caller object and sends it via a POST request to a server
// Created by Group A221a software semester 2 2022
// Responsible: Nicklas Christensen

// General test generator for callers
// implement form based test (DONE)
// implement RNG data (NOT DONE)

// PLACEHOLDER FUNCTION 
// NEEDED FOR GOOGLE MAPS LAT AND LONG

// Takes info written in the caller.html form and assigns it to variables
// The variables are used to assign data to a caller

function handleSubmit(event) {
  const data = new FormData(event.target);

  const name = data.get('name');

  const situation = data.get('situation');

  const address = data.get('address');

  const injuries = data.get('injuries');

  const description = data.get('description');

  info_placer(name, situation, address, injuries, description);
}

// Reads info from variables and determines whether there is a need for generating placeholders or not
function info_placer(name, situation, address, injuries, description) {
  let addressArr = [{ lat: 57.017145, lng: 9.987593 }, { lat: 57.052578, lng: 9.911738 }, { lat: 57.046832, lng: 9.913825 }];
  let addressArrIndex, formZeroLen = 0, numberMAX = 99999999, numberMIN = 10000000;
  let tempNumber = Math.floor(Math.random() * numberMAX);
  let latlngObj;
  tempNumber < numberMIN ? number = tempNumber + 10000000 : number = tempNumber;
  addressArrIndex = (Math.floor(Math.random() * addressArr.length));

  if (name.length === formZeroLen) name = "unknown caller";

  if (situation.length === formZeroLen) situation = "unknown situation";

  if (injuries.length === formZeroLen) injuries = "unknown injuries";

  if (description.length === formZeroLen) description = "No description provided";

  if (address.length === formZeroLen) {
    address = "Unknown address"
  } else {
    addGeoMarker(address).then(latlngObj => {
      info_placer_result(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex);
    }).catch(err => {
      console.log(err);
      info_placer_result(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex);
    });
    // Assigns the info values to an object
    clear_form();
  }
}

function info_placer_result(name, situation, injuries, description, address, latlngObj, addressArr, addressArrIndex) {
  let callObj = {
    name: name,
    location: locationObj = {
      address: address,
      lat: address === "Unknown address" || typeof (latlngObj) == String ? "" : latlngObj.lat,
      lng: address === "Unknown address" || typeof (latlngObj) == String ? "" : latlngObj.lng
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
