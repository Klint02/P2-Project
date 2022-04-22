//ECC operator class
export class operator {
    constructor(uname, psw) {
        this.uname = uname;
        this.psw = psw;
        this.id = uuidv4();
    }
}
//An event/accident/yougetit
export class event {
    constructor(lat, lng, type, adInfo, operator, address) {
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.adInfo = adInfo;
        this.operator = operator;
        //TODO: Get address with function
        //this.address =
    }
}