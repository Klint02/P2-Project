// caller.js v1.0
// FUNCTIONALITY: Creates a caller object and sends it via a POST request to a server
// Created by Group A221a software semester 2 2022
// Responsible: Nicklas Christensen

// General test generator for callers
// implement form based test (DONE)
// implement RNG data (NOT DONE)

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

// Reads info from variables and determines whether there is a need for generating placeholders or not
function infoPlacer(name, situation, address, injuries, description) {
  const FORMZEROLEN = 0, NUMBERMAX = 99999999, NUMBERMIN = 10000000;
  let tempNumber = Math.floor(Math.random() * NUMBERMAX);
  let latlngObj;
  tempNumber < NUMBERMIN ? number = tempNumber + 10000000 : number = tempNumber;

  if (name.length === FORMZEROLEN) name = "unknown caller";

  if (situation.length === FORMZEROLEN) situation = "unknown situation";

  if (injuries.length === FORMZEROLEN) injuries = "unknown injuries";

  if (description.length === FORMZEROLEN) description = "No description provided";
  
  if (address.length === FORMZEROLEN) {
    address = "Unknown address"
    infoPlacerResult(name, situation, injuries, description, address, latlngObj);
  } else {
    let templatlngObj;
    addGeoMarker(address).then((latlngObj) => {
      templatlngObj = latlngObj;
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      infoPlacerResult(name, situation, injuries, description, address, templatlngObj);
    });
  }
  clearForm();
}
// Assigns the info values to an object
function infoPlacerResult(name, situation, injuries, description, address, latlngObj) {
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
    AMLLocation: address === "Unknown address" ? AMLAalborg() : AMLRadius(latlngObj.lat, latlngObj.lng),
    injuries: injuries,
    answered: false,
    answering: false,
    active: false,
    useful: true,
    description: description
  }
  
  // Converts the object to a JSON string for the POST request
  let caller = JSON.stringify(callObj)
  sendJSON(caller);
}

// Generates a random set of coordinates within Aalborg and parses them as an object
// Used to generate a random onlooker for a given emergency without a known location
function AMLAalborg() {
  const LATMAX = 51250, LNGMAX = 134500, COORDCONVERTER = 1000000;
  let latOffset = Math.floor(Math.random() * LATMAX);
  let lngOffset = Math.floor(Math.random() * LNGMAX);
  let lat = ((57000000 + latOffset) / COORDCONVERTER);
  let lng = ((9865500 + lngOffset) / COORDCONVERTER);
  let AMLLocationObj = {
    lat: lat,
    lng: lng  
  }
 return AMLLocationObj;
}

// Takes given coordinates from a known address and offsets them
// Used to generate a random onlooker for a given emergency
function AMLRadius(lat, lng) {
  const RADIUS = 512, DIAMETER = 1024, LNGMAX = 134500, COORDCONVERTER = 1000000;
  let latOffset = Math.floor(Math.random() * DIAMETER - RADIUS);
  let lngOffset = Math.floor(Math.random() * DIAMETER - RADIUS);
  lat = (((lat * COORDCONVERTER) + latOffset) / COORDCONVERTER);
  lng = (((lng * COORDCONVERTER) + lngOffset) / COORDCONVERTER);
  let AMLLocationObj = {
    lat: lat,
    lng: lng  
  }
  return AMLLocationObj;
}

// Listens to when a form is submitted, and runs the handlesubmit function
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit(event);
});
