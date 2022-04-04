function handleSubmit(event) {
  const data = new FormData(event.target);

  const name = data.get('name');

  const situation = data.get('situation');
  
  const address = data.get('address');

  const number = data.get('number');

  const injuries = data.get('injuries');
  
  
  infoPlacer(name, situation, address, number, injuries);
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  handleSubmit(event);
  });

  
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

  let caller = {
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


  let test = JSON.stringify(caller)
  
  console.log(test);

}

/*
request.post({
  url: URL,
  headers: {
    this.name = name, 
    this.address = address, 
    this.whatIs = whatIs, 
    this.whenIs = whenIs, 
    this.phoneNumber = phoneNumber, 
    this.AMLLocation = AMLLocation, 
    this.HowManyPeople = HowManyPeople, 
    this.answered = false, 
    this.answering = false, 
    this.useful = true
  }
*/



