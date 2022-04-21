//if server is running on Nicklas' server set this to true,
//if run locally set to false
const online = true;

const http = require('http');
const fs = require("fs");
const url = require("url");
const { v4: uuidv4 } = require('uuid');
const { rejects } = require('assert');
const { addAbortSignal } = require('stream');
const { isArray } = require('util');
const operatorPath = "ServerData/operators.json";
let hostname;
online ? hostname = '192.168.1.72' : hostname = 'localhost';
const port = 8000;

//ECC operator class
class operator {
    constructor(uname, psw) {
        this.uname = uname;
        this.psw = psw;
        this.id = uuidv4();
    }
}
//An event/accident/yougetit
class event {
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



//Create server object with the function requestHandler as input
const server = http.createServer(requestHandler);

//Tells server to listen on ip and port
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
});

//Process a request, if it failes respond with error 500
function requestHandler(req, res) {
    try {
        processReq(req, res);
    } catch (err) {
        console.log("Internal Error: " + err);
        return errorResponse(res, 500, "Internal Error" + err);
    }
}

//Function to process a request, can fail hence the function requestHandler
function processReq(req, res) {
    //Remove the first "/" as we do not use absolute paths
    req.url = req.url.substring(1);
    //The webpages initial page is simply "/" which was just removed so it's
    //now "" but the actual page is "Pages/index.html", so we make a special case
    //for "/"
    req.url == "" ? req.url = "Pages/index.html" : req;
    //Depending on http method used, different handlers handle the request. If an
    //unexpected method type appears we attempt to respond with a default file 
    //response
    console.log("Request: " + req.method + " " + req.url);
    switch (req.method) {
        case 'POST':
            postHandler(req, res);
            break;
        case 'GET':
            getHandler(req, res);
            break;
        default:
            fileResponse(req.url, res);


    }
}
//Returns promise that retrieves post data in chunks
function getPostData(req) {
    return new Promise((resolve, reject) => {
        body = ""
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            if (body == "") reject("Empty post request");
            resolve(JSON.parse(body));
        });
    });
}


function postHandler(req, res) {
    let d = new Date()
    let path = "ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
    switch (req.url) {
        case "change_answering":
        case "emergency_accepted":
            //TODO: could potentially be moved to it's own function, but I couldn't be bothered
            // Get the content in the json file and change the answering variable and write the file
            getPostData(req).then(obj => {
                let content = importObject(path, res);
                content[obj.to_change].answering = obj.value
                exportObject(path, content, res);
            }).catch(err => {
                console.log(err);
                return errorResponse(res, 500, "Internal Error: Request failed: " + err);
            });
            break;
        case "callerobj":
            //TODO: could potentially be moved to it's own function, but I couldn't be bothered
            // Creates a date object 'd' the fs.writeFileSync uses to name it's documents by date
            // and writes the stringified json to its respective json document in the ServerData/CallerDB/caller-year-month-day.
            getPostData(req).then(caller => {
                // If the file does not exist, it will instead create one that is ready for json object input
                if (!fs.existsSync(path)) exportObject(path, '[]', res);
                //Check if an error has occured, if it hasn't: End. To prevent writing to ended stream
                if (!addCaller(path, caller, res)) res.end('ok');
            })
            break;
    }
}

// Function used to add a caller to DATE.json file
// Gives each caller a random UUID
function addCaller(path, caller, res) {
    caller.id = uuidv4();
    return exportObjectPush(path, caller, res);
}

//Handles http requests of method type GET
function getHandler(req, res) {
    //Split the url at "?" as first part is the path to the page and after is
    //arguments
    const splitUrl = req.url.split('?');
    //puts arguments in object args
    const args = getArgs(splitUrl[1]);
    //Depending on the requested page GET requests need to be handled differently
    switch (splitUrl[0]) {
        case "Pages/ECC/ecc.html":
            if (args.length > 0 || args["uname"] == undefined) break;
            //sets a cookie to a uuid if login is successfull
            res.setHeader("set-cookie", ["uuid=" + checkLogin(args, res) + ";secure"]);
            break;
    }
    //Continues response
    responseCompiler(req, res);
}

//So far does nothing exept continues, might do something later
function responseCompiler(req, res) {
    fileResponse(req.url, res);
}

//Default file responder simply responds with a file. GET/POST-handler
//can have changes the res(response) object with extra/modified data
//as both calls fileResponse after modifying res
function fileResponse(url, res) {
    //First part of the url split by "?" is the path
    const path = url.split('?')[0];
    //Last part of the path split is the name of the file
    const fileName = path.split('/')[path.split('/').length - 1];
    //Reads file from disk
    fs.readFile(path, (err, data) => {
        //In case of an error we assume the requested file does not exist
        //and respond with a 404 http code
        if (err) {
            console.error("404: Not Found: " + err);
            return errorResponse(res, 404, "404: Not Found: " + err);
        } else {
            //everything has now been handled correctly and we can repond
            //with a http 200 code
            res.statusCode = 200;
            //We need to tell what type of file the responded file is so
            //the browser knows what to do with it
            res.setHeader('Content-Type', determineMimeType(fileName));
            //Send the data
            res.write(data);
            //End the transmission
            res.end('\n');
        }
    })
}

//MIME type is an identifyer to help the browser understand what to do with
//a given file
function determineMimeType(fileName) {
    //Get the filetype fx "mp4" in "funny.mp4" we make the temp object to
    //avoid splitting twice as this can be an expensive operation
    let temp = fileName.split('.');
    let fileType = temp[temp.length - 1];
    const typeTable = {
        "js": "text/javascript",
        "html": "text/html",
        "css": "text/css",
        "ico": "image/vnd.microsoft.icon",
        "json": "application/json",
        "png": "image/png"
    }
    //returns the mimetype if it could be found in the typeTable
    //otherwise assume the type to be "text/plain"
    return (typeTable[fileType] || "text/plain");
}

//Responds with an error
function errorResponse(res, code, reason) {
    console.log(reason);
    res.statusCode = code;
    //Set type to "text/txt" because.... that's the simplest i guess
    res.setHeader('Content-Type', 'text/txt');
    //Write reason to user
    res.write(reason);
    res.end("\n");
    return reason
}

//Gets arguments from a request of method GET and puts them in a neat
//object
function getArgs(argsRaw) {
    let args = {};
    //if there are no arguments return an empty object
    if (argsRaw == undefined) return args;
    //Each argument in a url with method type GET is separated with a
    //"&" so we add all the arguments according to that
    argsRaw.split('&').forEach(element => {
        //All arguments looks like "uname=hello" so we set the key to
        //the part before "=" and the value to the part after
        args[element.split('=')[0]] = element.split('=')[1];
    });
    return args;
}

//Merges an object of type JSON with a object on the disk of type JSON
//Think of it like the Array.push() function but for objects on the
//disk
function exportObjectPush(path, object, res) {
    let arr = [];
    //We import the file first so we can add an object to it
    temp = importObject(path, res);

    //Check to see if imported array is not empty
    if (temp != "" && temp != "[]") arr = temp;
    //Check to make sure imported data is of type: array
    if (!Array.isArray(arr)) return errorResponse(res, 500, "Internal Error: Imported object is not Array, Path to object: " + path);
    //add the object to the end/start of the array
    arr.push(object);

    //Write the object to the disk
    return exportObject(path, arr, res);
}

//Exports an object to disk
function exportObject(path, object) {
    try {
        fs.writeFileSync(path, JSON.stringify(object, {
            //Just metadata stuffs
            encoding: "utf8",
            flag: "a+",
            mode: 0o666,
        }, 4));
        //The "4" adds lines in the file so the printed object is readable to humans
    } catch {
        return errorResponse(res, 500, "Internal Error: Could not write to disk, Path: " + path);
    }
}

//Reads an object from disk
function importObject(path, res) {
    //read a file synchronously, should probs be changed to read asynchronously
    //but deadlines
    let temp = "";
    try {
        temp = fs.readFileSync(path, 'utf8');
        if (temp != "") {
            return JSON.parse(temp);
        }
        return "";
    } catch {
        return errorResponse(res, 500, "Internal Error: Data file not found: " + path);
    }
}

//Checks login info
function checkLogin(args, res) {
    //Import valid logins obviously the object should be encrypted but this is fine
    //for a prototype
    const logins = importObject(operatorPath, res);
    //Goes through logins to see if one mathes
    for (let i = 0; i < logins.length; i++) {
        if (logins[i]["uname"] == args["uname"] && logins[i]["psw"] == args["psw"]) {
            //if the login is successfull a UUID is returned
            return logins[i]["id"];
        }
    }
    return "";
}