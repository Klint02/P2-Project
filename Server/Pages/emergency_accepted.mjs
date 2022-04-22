import { importObject, exportObject, getPostData } from "../helpers.mjs";
import { errorResponse } from "../responseHandlers.mjs";

export function page_emergency_accepted(req, res, path) {
    //TODO: could potentially be moved to it's own function, but I couldn't be bothered
    // Get the content in the json file and change the answering variable and write the file
    getPostData(req).then(obj => {
        let content = importObject(path, res);
        content[obj.to_change].answering = obj.value
        if (exportObject(path, content, res) == 1) return 1;
    }).catch(err => {
        return errorResponse(res, 500, "Internal Error: Request failed: " + err);
    });
}