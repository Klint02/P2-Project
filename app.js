//if server is running on Nicklas' server set this to true,
//if run locally set to false
const online = false;

import * as http from 'http';
import * as fs from 'fs';
import * as url from 'url';
//const fs = require("fs");
//const url = require("url");
//const { v4: uuidv4 } = require('uuid');
//const { rejects } = require('assert');
//const { addAbortSignal } = require('stream');
//const { isArray } = require('util');
const operatorPath = "Server/ServerData/operators.json";

let hostname;
online ? hostname = '192.168.1.72' : hostname = 'localhost';
const port = 8000;

import { operator, event } from './Server/classes.mjs';
import { postHandler, getHandler, fileResponse, errorResponse } from './Server/responseHandlers.mjs';



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
        processReq(req, res, operatorPath);
    } catch (err) {
        errorResponse(res, 500, "Internal Error" + err);
    }
}

//Function to process a request, can fail hence the function requestHandler
function processReq(req, res, operatorPath) {
    //Remove the first "/" as we do not use absolute paths
    req.url = req.url.substring(1);
    //The webpages initial page is simply "/" which was just removed so it's
    //now "" but the actual page is "Pages/index.html", so we make a special case
    //for "/"
    req.url == "" ? req.url = "Pages/index.html" : req;
    //Depending on http method used, different handlers handle the request. If an
    //unexpected method type appears we attempt to respond with a default file 
    //response
    //console.log("Request: " + req.method + " " + req.url);
    switch (req.method) {
        case 'POST':
            return postHandler(req, res);
        case 'GET':
            return getHandler(req, res, operatorPath);
        default:
            return fileResponse(req.url, res);


function postHandler(req, res) {
    let d = new Date()
    let path = "ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
    switch (req.url) {
        case "change_answering":
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
        case "emergency_accepted":
            //TODO: could potentially be moved to it's own function, but I couldn't be bothered
            // Get the content in the json file and change the answering variable and write the file
            getPostData(req).then(obj => {
                let content = importObject(path, res);
                content[obj.to_change].answered = obj.value
                content[obj.to_change].active = obj.value
                exportObject(path, content, res);
            }).catch(err => {
                console.log(err);
                return errorResponse(res, 500, "Internal Error: Request failed: " + err);
            });
            break;
        case "emergency_handled":
            getPostData(req).then(obj => {
                let content = importObject(path, res);
                // Find the place where the id match
                for (let i = 0; i < content.length; i++) {
                    if (content[i].id == obj.to_change) {
                        content[i].active = obj.value;
                    }
                }
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