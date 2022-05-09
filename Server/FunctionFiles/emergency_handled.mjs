import { errorResponse } from "../responseHandlers.mjs";
import { importObject, exportObject, getPostData } from "../serverHelpers.mjs";


//When a call/marker gets deleted this function changes the active value to false(actually incoming value)
export function pageEmergencyHandled(req, res, path) {
    getPostData(req).then(obj => {
        let content = importObject(path, res);
        // Find the place where the id match
        for (let i = 0; i < content.length; i++) {
            if (content[i].id == obj.to_change) {
                content[i].active = obj.value;
            }
        }
        exportObject(path, content, res);
        res.statusCode = 200;
        res.end("\n");
    }).catch(err => {
        console.log(err);
        return errorResponse(res, 500, "Internal Error: Request failed: " + err);
    });
}