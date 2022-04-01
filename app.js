const online = false;

const http = require('http');
const fs = require("fs");
const url = require("url");
const { v4: uuidv4 } = require('uuid');
const operatorPath = "ServerData/operators.json";
let hostname;
online ? hostname = 'onlinehost' : hostname = 'localhost';
const port = 8000;

class operator {
    constructor(uname, psw) {
        this.uname = uname;
        this.psw = psw;
        this.id = uuidv4();
    }
}
class event {
    constructor(lat, lng, type, adInfo, operator) {
        this.lat = lat;
        this.lng = lng;
        this.type = type;
        this.adInfo = adInfo;
        this.operator = operator;
        //this.address =
    }
}


const server = http.createServer(requestHandler);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    fs.writeFileSync('message.txt', `Server running at http://${hostname}:${port}/`);
});

function requestHandler(req, res) {
    try {
        processReq(req, res);
    } catch (err) {
        console.log("Internal Error: " + err);
        errorResponse(res, 500, "");
    }
}

function processReq(req, res) {
    console.log(req.url);
    req.url = req.url.substring(1);
    req.url == "" ? req.url = "Pages/index.html" : req;
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

function postHandler(req, res) {
    console.log(req.body);
    //console.log(req.headers);
}

function getHandler(req, res) {
    const splitUrl = req.url.split('?');
    const args = getArgs(splitUrl[1]);
    console.log(args);
    switch (req.url.split('?')[0]) {
        case "Pages/ECC/ecc.html":
            res.setHeader("set-cookie", ["uuid=" + checkLogin(args)]);
            break;
        /*    
        case "Pages/Caller/caller.html":
            callerPage(args);
            break;
        */
    }
    responseCompiler(req, res);
}
/*
function callerPage(args) {
    console.log(args); 

}
*/
function responseCompiler(req, res) {
    fileResponse(req.url, res);
}

function fileResponse(url, res) {
    const path = url.split('?')[0];
    const fileName = path.split('/')[path.split('/').length - 1];
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
            errorResponse(res, 404, String(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', determineMimeType(fileName));
            res.write(data);
            res.end('\n');
        }
    })
}

function determineMimeType(fileName) {
    fileName = fileName.split('.')[1];
    const typeTable = {
        "js": "text/javascript",
        "html": "text/html",
        "css": "text/css",
        "ico": "image/vnd.microsoft.icon",
        "json": "application/json",
        "png": "image/png"
    }
    return (typeTable[fileName] || "text/plain");
}

function errorResponse(res, code, reason) {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/txt');
    res.write(reason);
    res.end("\n");
}

function getArgs(argsRaw) {
    let args = {};
    if (argsRaw == undefined) return args;
    if (argsRaw.length > 1) {
        console.log("parsing");
        argsRaw.split('&').forEach(element => {
            args[element.split('=')[0]] = element.split('=')[1];
        });
    }
    return args;
}

//Writes an object to disk
function exportObject(path, object) {
    let arr = [];
    let temp = importObject(path);
    if (temp != "") {
        arr = temp;
    }
    arr.push(object);

    fs.writeFileSync(path, JSON.stringify(arr), { encoding: "utf8" });
}

//Reads an object from disk
function importObject(path) {
    let temp = fs.readFileSync(path, "utf8");
    if (temp != "") {
        return JSON.parse(temp);
    }
    return "";
}

//Checks login info
function checkLogin(args) {
    const logins = importObject(operatorPath);
    for (let i = 0; i < logins.length; i++) {
        console.log(logins[i]["uname"] + " : " + args["uname"]);
        if (logins[i]["uname"] == args["uname"] && logins[i]["psw"] == args["psw"]) {
            console.log("succ2");
            return logins[i]["id"];
        }
    }
    return "";
}
