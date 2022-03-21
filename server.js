// Decides whether the server is run locally
const local = true; 

host();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const operatorPath = "ServerData/operators.json";
const eventPath = "ServerData/events.json";
class operator {
    constructor(uname, psw){
        this.uname = uname;
        this.psw = psw;
        this.id = uuidv4();
    }
}
class event{
    constructor(lat, lng, type, adInfo, operator, tlfnr){
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.adInfo = adInfo;
        this.operator = operator;
        this.tlfnr = tlfnr;
        //this.address =
    }
}


//Change to true and enter details in the new operator line ONLY RUN THE SERVER ONCE WITH THIS SET TO TRUE
if(0) {
    const obj = new operator("Thomas", "1234");
    exportObject(operatorPath, obj);
}
if(0) {
    const obj = new event("57.05270767455275", "9.913094102327587", "Fire", "Alle døde", "ffe4305b-83a1-4274-896d-458c672aca0e","40959636");
    exportObject(eventPath, obj);
}


// Sites and files that are currently available to view and use. MAKE SURE THERE FILES EXIST
const validSites = ["/index.html",
                    "/Pages/ECC/send_sse.php",
                    "/Pages/ECC/ecc.html",
                    "/Pages/ECC/ecc.js",
                    "/Pages/ECC/ecc.css",
                    "/Pages/ECC/login.js",
                    "/Pages/Caller/caller.html"
                ];
const validSuffixes = ["html",
                        "js",
                        "mjs",
                        "css",
                        "php"
];

//Main funtion for hosting the server
function host(){
    //HTTP essential stuff
    const http = require("http");
    const fs = require('fs').promises;
    let host = '192.168.1.72';
    if(local){
        host = 'localhost'; 
    }
    const port = 8000;

    const requestListener = function (req, res) {
        //Parses the incoming URL
        const temp = req.url.toString().split('?');
        let args = getArgs(temp);
        let file = temp[0];
        if(file == "/"){
            file = "/index.html"
        }
        const fileType = file.split('.')[1];
        
        //Essential host stuff
        if(validSites.contains(file) && validSuffixes.contains(fileType)){
            console.log(file);
            file = file.substring(1);
            let cookie = "";
            console.log(file);class event{
                constructor(lat, lng, type, adInfo, operator){
                    this.lat = lat;
                    this.lng = lng;
                    this.type = type;
                    this.adInfo = adInfo;
                    this.operator = operator;
                    //this.address =
                }
            }
            console.log("Page not found in validSites: \"" + file + "\"");
            res.writeHead(404);
            res.end("Page not found: " + file);
            return;
        }
    };

    Array.prototype.contains = function (tester) {
        for(let i = 0; i < this.length; i++) { 
            if(this[i] == tester){
                return true;
            }        
        };
        return false;
    }

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

// Determines the MIME type of a file according to its file extension
function getMIMEType(fileType){
    let temp = "text/";
    if(fileType == "js"){
        temp += "javascript";
    } else if(fileType == "php") {
        temp += "event-stream";
    }else {
        temp += fileType;
    }
    return temp;
}

//takes raw arguments and returns them neatly as an object
function getArgs(argsRaw){
    let args = {}
    if(argsRaw.length > 1) {
        argsRaw[1].split('&').forEach(element => {
            args[element.split('=')[0]] = element.split('=')[1];
        });
    }
    return args;
}


//Writes an object to disk
function exportObject(path, object){
    let arr = [];
    let temp = importObject(path);
    if(temp != ""){
        arr = temp;
    }
    arr.push(object);
    
    fs.writeFileSync(path, JSON.stringify(arr), {encoding: "utf8"});
}

//Reads an object from disk
function importObject(path){
    let temp = fs.readFileSync(path, "utf8");
    if(temp != ""){
        return JSON.parse(temp);
    }
    return "";
}

//Checks login info
function checkLogin(args){
    const logins = importObject(operatorPath);
    for(let i = 0; i < logins.length; i++){
        if(logins[i]["uname"] == args["uname"] && logins[i]["psw"] == args["psw"]){
            return logins[i]["id"];
        }
    }
    return "";
}

