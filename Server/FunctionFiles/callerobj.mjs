import * as fs from 'fs'

import { exportObject } from '../serverHelpers.mjs';
import { getPostData } from "../serverHelpers.mjs";
import { addCaller } from '../serverHelpers.mjs';
import { errorResponse } from '../responseHandlers.mjs';

//Takes a POST request with JSON attached and exports it
export function pageCallerObj(req, res, path) {
    // Creates a date object 'd' the fs.writeFileSync uses to name it's documents by date
    // and writes the stringified json to its respective json document in the Server/ServerData/CallerDB/caller-year-month-day.
    getPostData(req).then(caller => {
        // If the file does not exist, it will instead create one that is ready for json object input
        if (!fs.existsSync(path)) {
            if (exportObject(path, '[]', res)) {
                errorResponse(res, 500, "Could not export object: ", path);
                return 1;
            }
        }
        res.statusCode = 200;
        res.end("\n");
        return addCaller(path, caller, res);
    })
}