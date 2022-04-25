import { importObject } from "../helpers.mjs";
import { errorResponse } from "../responseHandlers.mjs";

export function pageEcc(args, res, operatorPath) {
    if (args.length > 0 || args["uname"] == undefined) return;
    //sets a cookie to a uuid if login is successfull
    const cookie = checkLogin(args, res, operatorPath);
    if (cookie == 1) return 1;
    res.setHeader("set-cookie", ["uuid=" + cookie + ";secure"]);
}

//Checks login info
export function checkLogin(args, res, operatorPath) {
    //Import valid logins obviously the object should be encrypted but this is fine
    //for a prototype
    const logins = importObject(operatorPath, res);
    if (logins == 1) return 1;
    //Goes through logins to see if one mathes
    for (let i = 0; i < logins.length; i++) {
        if (logins[i]["uname"] == args["uname"] && logins[i]["psw"] == args["psw"]) {
            //if the login is successfull a UUID is returned
            return logins[i]["id"];
        }
    }
    return "";
}