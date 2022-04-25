function page_emergency_handled(req) {
    getPostData(req).then(obj => {
        let content = importObject(path, res);
        // Find the place where the id match
        for (let i = 0; i < content.length; i++) {
            if (content[i].id == obj.to_change) {
                content[i].active = obj.value;
            }
        }
        exportObject(path, content, res);
    }).catch(err => {
        console.log(err);
        return errorResponse(res, 500, "Internal Error: Request failed: " + err);
    });
}