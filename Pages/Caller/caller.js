let addressArr = ["57.017145, 9.987593", "57.052578, 9.911738", "57.046832, 9.913825"];
let callerArr = ["Edward Sandersen", "Walter Hvid", "Herman Olsen"];
let phoneArr = ["40302321", "12345678", "88888888"];
let addressArrIndex
let callerArrIndex
let phoneArrIndex

function AMLSelectIndex() {
  callerArrIndex = (Math.floor(Math.random() * callerArr.length));
  addressArrIndex = (Math.floor(Math.random() * callerArr.length));
  phoneArrIndex = (Math.floor(Math.random() * callerArr.length));
}

AMLSelectIndex();
console.log(callerArrIndex);

function handleSubmit(event) {
  const data = new FormData(event.target);

  const name = data.get('name');

  const address = data.get('address');

  const situation = data.get('situation');
  
  console.log(address, name, situation);
  amlTree(name, address, situation);

 

 
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit(event);
  });

function amlTree(name, address, situation) {
  if (name.length === 0){
    console.log();
    name = "unknown caller";
  }
  if (address === ''){
    address = addressArr[addressArrIndex];
  }
  phoneNumber = phoneArr[phoneArrIndex];
  if (situation === ''){
    situation = 'unknown situation';
  }
  console.log(address, name, situation, phoneNumber);
  //return(name, address, situation, phoneNumber); 
  //
}
