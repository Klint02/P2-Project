

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
  let addressArr = ["57.017145, 9.987593", "57.052578, 9.911738", "57.046832, 9.913825"];
  let addressArrIndex
  addressArrIndex = (Math.floor(Math.random() * addressArr.length));


  if (name.length === 0){
    name = "unknown caller";
  }
  if (situation.length === 0) {
    situation = "unknown situation";
  }
  if (address.length === 0){
    address = "Unknown address"
  }
  if (number.length === 0) {
    let tempNumber = Math.floor(Math.random() * 99999999);
    tempNumber < 10000000 ? number = 10000000 : number = tempNumber;
  }
  if (injuries.length === 0) {
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


  let caller = JSON.stringify(callObj)
  
  

  sendJSON(callObj);

}
/*
function sendJSON(caller){
    
  // Creating a XHR object
  let xhr = new XMLHttpRequest();
  let url = "Pages/Caller/caller.html";

  // open a connection
  xhr.open("POST", url, true);

  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  // Create a state change callback
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {

          // Print received data from server
          result.innerHTML = this.responseText;

      }
  };
  console.log("test");
  // Sending data with the request
  xhr.send(caller);
}
*/
/*
async function sendJSON(caller) {
// request options
const response = await fetch('Pages/Caller/caller', {
  method: 'POST',
  body: JSON.stringify(caller)
});
const responseText = await response.text();
console.log(responseText); // logs 'OK'
}
*/
