import { getPostData, importObject, exportObject } from "../serverHelpers.mjs"
import { errorResponse } from "../responseHandlers.mjs";

export function pageChangeAnswering(req, res, path) {
    //TODO: could potentially be moved to it's own function, but I couldn't be bothered
    // Get the content in the json file and change the answering variable and write the file
    getPostData(req).then(obj => {
        let content = importObject(path, res);
        content[obj.to_change].answering = obj.value
        exportObject(path, content, res);
        res.statusCode = 200;
        res.end("\n");
    }).catch(err => {
        console.log(err);
        return errorResponse(res, 500, "Internal Error: Request failed: " + err);
    });
}