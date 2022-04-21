export function page_ecc(args, res) {
    if (args.length > 0 || args["uname"] == undefined) return;
    //sets a cookie to a uuid if login is successfull
    res.setHeader("set-cookie", ["uuid=" + checkLogin(args, res) + ";secure"]);
}

//Checks login info
export function checkLogin(args, res) {
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