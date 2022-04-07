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

  const number = data.get('number');

  const injuries = data.get('injuries');
  
  infoPlacer(name, situation, address, number, injuries);
}


// Listens to when a form is submitted, and runs the handlesubmit function
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit(event);
  });


// Reads info from variables and determines whether there is a need for generating placeholders or not
function infoPlacer(name, situation, address, number, injuries) {
  let addressArr = [{ lat: 57.017145, lng: 9.987593}, { lat: 57.052578, lng: 9.911738}, { lat: 57.046832, lng: 9.913825}];
  let addressArrIndex, formZeroLen = 0, numberMAX = 99999999, numberMIN = 10000000;
  
  addressArrIndex = (Math.floor(Math.random() * addressArr.length));
  console.log(addressArrIndex);

  if (name.length === formZeroLen){
    name = "unknown caller";
  }
  if (situation.length === formZeroLen) {
    situation = "unknown situation";
  }
  if (address.length === formZeroLen){
    address = "Unknown address"
  }
  if (number.length === formZeroLen) {
    let tempNumber = Math.floor(Math.random() * numberMAX);
    tempNumber < numberMIN ? number = tempNumber + 10000000: number = tempNumber;
  }
  if (injuries.length === formZeroLen) {
    injuries = "unknown injuries";
  }

  // Assigns the info values to an object
  let callObj = {
    name: name, 
    address: address, 
    situation: situation,  
    number: number,
    timeset: new Date().toLocaleString("da-DK", {timeZone: "Europe/Copenhagen"}),
    AMLLocation: addressArr[addressArrIndex], 
    injuries: injuries, 
    answered: false, 
    answering: false, 
    useful: true
  }

  // Converts the object to a JSON string for the POST request
  let caller = JSON.stringify(callObj)
  sendJSON(caller);
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
