import { importObject, exportObject, exportObjectPush } from "../serverHelpers.mjs";
import { errorResponse } from "../responseHandlers.mjs";
import { getPostData } from "../serverHelpers.mjs";
import { v4 as uuidv4 } from "uuid";
import * as fs from 'fs'

export function confirm(req, res, path) {
    getPostData(req).then((data) => {
        if (!fs.existsSync(path)) {
            if (exportObject(path, [], res)) {
                errorResponse(res, 500, "Could not export object: ", path);
                return 1;
            }
        }
        let calls = importObject(path);
        if (calls === 1) return 1;
        let found = false;
        let i = 0;
        for (i = 0; i < calls.length; i++) {
            if (calls[i].id == data.id) {
                calls[i].name = data.name;
                calls[i].situation = data.situation;
                calls[i].injuries = data.injuries;
                calls[i].description = data.description;
                calls[i].answered = true;
                calls[i].active = true;
                if (data.location.address.search("(Lat:.{1,}Lng:)") > 0) data.location.address = "Unknown address";
                calls[i].location.address = data.location.address;
                calls[i].location.lat = data.location.lat;
                calls[i].location.lng = data.location.lng;
                found = true;
                break;
            }
        }
        if (!found) {
            let callObj = {
                name: data.name,
                location: {
                    address: data.location.address,
                    lat: data.location.lat,
                    lng: data.location.lng
                },
                situation: data.situation,
                number: 0,
                timeset: new Date().toLocaleString("da-DK", { timeZone: "Europe/Copenhagen" }),
                AMLLocation: { lat: 0, lng: 0 },
                injuries: data.injuries || "No info available",
                answered: true,
                answering: true,
                active: true,
                useful: true,
                description: data.description || "No description provided",
                links: [],
                id: uuidv4()
            }
            calls.push(callObj);
        }
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
        errorResponse(res, 500, "Error recieving client data: " + path + "\n\n Error:" + err);
        return 1;
    })
}