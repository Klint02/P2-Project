import { importObject, getPostData } from "../serverHelpers.mjs";
import { errorResponse, fileResponse } from "../responseHandlers.mjs";

export function pageEcc(req, res, operatorPath) {
    getPostData(req).then(obj => {
        console.log(obj);
        const cookie = checkLogin(obj, res, operatorPath);
        if (cookie == 1) {
            errorResponse(res, 403, "Login failed");
            return 1;
        };
        //Secure commeneted out because online server is running without TLS/SSL
        res.setHeader("set-cookie", ["uuid=" + cookie /*+ ";secure"*/]);
        fileResponse(req.url, res);
    }).catch(err => {
        console.log(err);
        errorResponse(res, 500, "Failed to process request");
        return 1;
    })
}

//Checks login info
export function checkLogin(obj, res, operatorPath) {
    //Import valid logins obviously the object should be encrypted but this is fine
    //for a prototype
    const logins = importObject(operatorPath, res);
    if (logins == 1) return 1;
    //Goes through logins to see if one mathes
    for (let i = 0; i < logins.length; i++) {
        if (logins[i]["uname"] == obj["uname"] && logins[i]["psw"] == obj["psw"]) {
            //if the login is successfull a UUID is returned
            return logins[i]["id"];
        }
    }
    return "";
}