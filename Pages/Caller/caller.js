// caller.js v1.1
// FUNCTIONALITY: Creates a caller object and sends it via a POST request to a server
// Created by Group A221a software semester 2 2022
// Responsible: Nicklas Christensen and Rasmus Bertelsen

// General test generator for callers
// implement form based test (DONE)
// implement RNG data (DONE)

// Listens to when a form is submitted, and runs the handlesubmit function
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  const FORMZEROLEN = 0;
  let rawData = {
  }
  event.preventDefault();
  handleSubmit(event, rawData);
  infoPlacer(rawData, FORMZEROLEN);
  genPhoneNumber(rawData);
  geoCreator(rawData, FORMZEROLEN);
  clearForm();
});

//When rng button is clicked:
document.getElementById("RNG").addEventListener('click', (event) => {
  const FORMZEROLEN = 0;
  let rawData = {
  }
  infoRNG(rawData, nameDB, situationDB, addressDB, FORMZEROLEN);
  genPhoneNumber(rawData);
  geoCreator(rawData, FORMZEROLEN);
});

// Takes info written in the caller.html form and assigns it to variables
// The variables are used to assign data to a caller
function handleSubmit(event, rawData) {
  const data = new FormData(event.target);

  rawData.name = data.get('name');

  rawData.situation = data.get('situation');

  rawData.address = data.get('address');

  rawData.injuries = data.get('injuries');

  rawData.description = data.get('description');
}

// Reads info from variables and determines whether there is a need for generating placeholders or not
function infoPlacer(rawData, FORMZEROLEN) {

  if (rawData.name.length === FORMZEROLEN) rawData.name = "unknown caller";

  if (rawData.situation.length === FORMZEROLEN) rawData.situation = "unknown situation";

  if (rawData.injuries.length === FORMZEROLEN) rawData.injuries = "unknown injuries";

  if (rawData.description.length === FORMZEROLEN) rawData.description = "No description provided";
}

//Tries to get an address autmatically, if it can't simply sets the adress to "Unknown address"
function geoCreator(rawData, FORMZEROLEN) {
  let latlngObj;
  if (rawData.address.length === FORMZEROLEN || rawData.address === "Unknown address") {
    rawData.address = "Unknown address"
    infoPlacerResult(rawData, latlngObj);
  } else {
    let templatlngObj;
    addGeoMarker(rawData.address).then((latlngObj) => {
      templatlngObj = latlngObj;
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      infoPlacerResult(rawData, templatlngObj);
    });
  }
}

//Generates a random phone number
function genPhoneNumber(rawData) {
  const NUMBERMAX = 99999999, NUMBERMIN = 10000000;
  let tempNumber = Math.floor(Math.random() * NUMBERMAX);

  tempNumber < NUMBERMIN ? rawData.number = tempNumber + 10000000 : rawData.number = tempNumber;
}

// Assigns the info values to an object
function infoPlacerResult(rawData, latlngObj) {
  let callObj = {
    name: rawData.name,
    location: locationObj = {
      address: rawData.address,
      lat: rawData.address === "Unknown address" || typeof (latlngObj) == String ? "" : latlngObj.lat,
      lng: rawData.address === "Unknown address" || typeof (latlngObj) == String ? "" : latlngObj.lng
    },
    situation: rawData.situation,
    number: rawData.number,
    timeset: new Date().toLocaleString("da-DK", { timeZone: "Europe/Copenhagen" }),
    AMLLocation: rawData.address === "Unknown address" ? AMLAalborg() : AMLRadius(latlngObj.lat, latlngObj.lng),
    injuries: rawData.injuries,
    answered: false,
    answering: false,
    active: false,
    useful: true,
    description: rawData.description,
    links: []
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

// Pulls random elements of arrays and assigns it to the rawData object
function infoRNG(rawData, nameDB, situationDB, addressDB) {
  rawData.name = nameDB[Math.floor(Math.random() * nameDB.length)];

  rawData.situation = situationDB[Math.floor(Math.random() * situationDB.length)];

  rawData.address = addressDB[Math.floor(Math.random() * addressDB.length)];

  rawData.injuries = randomNumberOfInjured();

  rawData.description = "No description provided";

}

// Makes a random number of injured people
function randomNumberOfInjured() {
  let injured = Math.floor(Math.random() * 20);
  let critical = Math.floor(Math.random() * 20);
  let killed = Math.floor(Math.random() * 10);
  let string;

  if (critical > 0 && injured > 0 && killed > 0) {
    string = `${injured} People are injured, and ${critical} are in critical condition, and ${killed} killed`;
  } else if (critical > 0 && injured === 0) {
    string = `${critical} people critically injured`;
  } else if (injured > 0 && critical === 0) {
    string = `${injured} people injured`;
  } else {
    string = `${killed} people killed`;
  }
  return string;
}

