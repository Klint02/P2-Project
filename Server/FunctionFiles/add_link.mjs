import { exportObject, importObject } from "../serverHelpers.mjs";
import { getPostData } from "../serverHelpers.mjs";

//Used to add a link to the opposing marker.
export function addLink(req, res, path) {
    getPostData(req).then(inputObj => {
        if (exportLink(inputObj.objID, inputObj.curentObjID, path, res) == 1) return 1;
    });
}

//Appends a link to an opposing marker/call
function exportLink(id, currentObjId, path, res) {
    let events = importObject(path, res);
    //If import fails to import an object it returns a 1, so it is checked for here
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