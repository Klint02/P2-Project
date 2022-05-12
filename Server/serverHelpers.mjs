import { v4 as uuidv4 } from "uuid";
import { errorResponse } from "./responseHandlers.mjs";
import * as fs from 'fs';

//MIME type is an identifyer to help the browser understand what to do with
//a given file
export function determineMimeType(fileName) {
    //Get the filetype fx "mp4" in "funny.mp4" we make the temp object to
    //avoid splitting twice as this can be an expensive operation
    let temp = fileName.split('.');
    let fileType = temp[temp.length - 1];
    const typeTable = {
        "js": "text/javascript",
        "mjs": "text/javascript",
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

//Gets arguments from a request of method GET and puts them in a neat
//object
export function getArgs(argsRaw) {
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

//Merges an object of timportObjectype JSON with a object on the disk of type JSON
//Think of it like the Array.push() function but for objects on the
//disk
export function exportObjectPush(path, object, res) {
    let arr = [];
    //We import the file first so we can add an object to it
    let temp = importObject(path, res);
    if (temp == 1) return 1;

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
export function exportObject(path, object, res) {
    try {
        fs.writeFileSync(path, JSON.stringify(object, {
            //Just metadata stuffs
            encoding: "utf8",
            flag: "a+",
            mode: 0o666,
        }, 4));
        //The "4" adds lines in the file so the printed object is readable to humans
        return 0;
    } catch {
        return errorResponse(res, 500, "Internal Error: Could not write to disk, Path: " + path);
    }
}

//Reads an object from disk
export function importObject(path, res) {
    //read a file synchronously, should probs be changed to read asynchronously
    //but deadlines
    let temp = "";
    try {
        temp = fs.readFileSync(path, 'utf8');
        if (temp != "") {
            return JSON.parse(temp);
        }
        errorResponse(res, 500, "Internal Error: Data file not found: " + path);
        return 1;
    } catch (err) {
        errorResponse(res, 500, "Internal Error: Reading file failed " + path + "  :  Cought error: " + err);
        return 1;
    }
}

//Returns promise that retrieves post data in chunks
export function getPostData(req) {
    return new Promise((resolve, reject) => {
        let body = ""
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            if (body == "") reject("Empty post request");
            resolve(JSON.parse(body));
        });
    });
}

// Used to add a caller to DATE.json file and gives each caller a random UUID
export function addCaller(path, caller, res) {
    caller.id = uuidv4();
    if (exportObjectPush(path, caller, res) == 1) return 1;
    return 0;
}

//Gets the last element in an array after splitting a string
export function getLastSplit(input, splitChar) {
    const temp = input.split(splitChar);
    return temp[temp.length - 1]
}