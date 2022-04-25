import { pageCallerObj as pageCallerObj } from "./Pages/callerobj.mjs";
import { pageEmergencyAccepted } from "./Pages/emergency_accepted.mjs";
import { pageEmergencyHandled } from "./Pages/emergency_handled.mjs";
import { pageEcc as pageEcc } from "./Pages/ecc.mjs";
import { pageChangeAnswering as pageChangeAnswering } from "./Pages/change_answering.mjs"
import { determineMimeType, addCaller } from "./helpers.mjs";
import { getArgs as getArgs } from "./helpers.mjs";
import * as fs from 'fs';
import { operator } from "./classes.mjs";

export function postHandler(req, res) {
    let d = new Date()
    let path = "Server/ServerData/CallerDB/callers" + "-" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + ".json";
    switch (req.url) {
        case "change_answering":
            console.log(pageChangeAnswering(req, res, path));
            break;
        case "emergency_accepted":
            console.log(pageEmergencyAccepted(req, res, path));
            break;
        case "emergency_handled":
            console.log(pageEmergencyHandled(req, res, path));
            break;
        case "callerobj":
            return pageCallerObj(req, res, path);
            break;

    }
}



//Handles http requests of method type GET
export function getHandler(req, res, operatorPath) {
    //Split the url at "?" as first part is the path to the page and after is
    //arguments
    const splitUrl = req.url.split('?');
    //puts arguments in object args
    const args = getArgs(splitUrl[1]);
    //Depending on the requested page GET requests need to be handled differently
    switch (splitUrl[0]) {
        case "Pages/ECC/ecc.html":
            if (pageEcc(args, res, operatorPath) == 1) return 1;
            break;
    }
    //Continues response
    responseCompiler(req, res);
}



//So far does nothing exept continues, might do something later
export function responseCompiler(req, res) {
    fileResponse(req.url, res);
}

//Default file responder simply responds with a file. GET/POST-handler
//can have changes the res(response) object with extra/modified data
//as both calls fileResponse after modifying res
export function fileResponse(url, res) {
    //First part of the url split by "?" is the path
    const path = url.split('?')[0];
    //Last part of the path split is the name of the file
    const fileName = path.split('/')[path.split('/').length - 1];
    //Reads file from disk
    fs.readFile(path, (err, data) => {
        //In case of an error we assume the requested file does not exist
        //and respond with a 404 http code
        if (err) {
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

//Responds with an error
export function errorResponse(res, code, reason) {
    console.log(reason);
    //Set type to "text/txt" because.... that's the simplest i guess
    res.setHeader('Content-Type', 'text/txt');
    res.statusCode = code;
    //Write reason to user
    res.write(reason);
    res.end("\n");
    return 1;
}