import { getPostData } from "../../../Server/serverHelpers.mjs";
import { importObject, exportObject } from "../../../Server/serverHelpers.mjs";
import { errorResponse } from "../../../Server/responseHandlers.mjs";

export function confirm(req, res, path) {
    getPostData(req).then((data) => {
        console.log(data);
        let calls = importObject(path);
        if (calls === 1) return 1;
        let found = false;
        let i = 0;
        for (i = 0; i < calls.length; i++) {
            if (calls[i].id == data.id) {
                calls[i].name = data.name;
                calls[i].situation = data.situation;
                calls[i].address = data.address;
                calls[i].injuries = data.injuries;
                calls[i].description = data.description;
                calls[i].answered = true;
                calls[i].active = true;
                found = true;
                break;
            }
        }
        if (!found) return 1;
        if (exportObject(path, calls, res)) return 1;

        res.statusCode = 200;
        res.write(JSON.stringify(calls[i], {
            //Just metadata stuffs
            encoding: "utf8",
            flag: "a+",
            mode: 0o666,
        }));
        res.end("\n");
    }).catch(err => {
        errorResponse(res, 500, "Error recieving client data: " + path);
        return 1;
    })
}