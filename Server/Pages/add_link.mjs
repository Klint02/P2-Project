import { exportObject, importObject } from "../helpers.mjs";
import { getPostData } from "../helpers.mjs";

export function addLink(req, res, path) {
    getPostData(req).then(inputObj => {
        if (exportLink(inputObj.objID, inputObj.curentObjID, path, res) == 1) return 1;
    });
}

function exportLink(id, currentObjId, path, res) {
    let events = importObject(path, res);
    if (events == 1) return 1;
    for (let i = 0; i < events.length; i++) {
        if (id == events[i].id) {
            events[i].links.push(currentObjId);
        }
        if (currentObjId == events[i].id) {
            events[i].active = true;
            events[i].answered = true;
            events[i].links.push(id);
        }
    }
    if (exportObject(path, events, res) == 1) return 1;;
    res.statusCode = 200;
    res.end("\n");
}