const local = false; 
host();

const validSites = ["/index.html",
                    "/Pages/ECC/ecc.html",
                    "/Pages/ECC/ecc.js",
                    "/Pages/ECC/ecc.css",
                    "/Pages/Caller/caller.html"
                ];
const validSuffixes = ["html",
                        "js",
                        "mjs",
                        "css"
];

function host(){
    const http = require("http");
    const fs = require('fs').promises;
    let host = '192.168.1.72';
    if(local){
        host = 'localhost'; 
    }
    
    const port = 8000;
    const requestListener = function (req, res) {
        const temp = req.url.toString().split('?');
        let file = temp[0];
        if(file == "/"){
            file = "/index.html"
        }
        const fileType = file.split('.')[1];
        const arguments = temp[1];
        
        if(validSites.contains(file) && validSuffixes.contains(fileType)){
            
            file = file.substring(1);
            console.log(file);

            fs.readFile(file)
                .then(contents => {
                    res.setHeader("Content-Type", getContentType(fileType));
                    res.writeHead(200);
                    res.end(contents);
                })
                .catch(err => {
                    console.log("Page does not exist in file system: " + file);
                    res.writeHead(500);
                    res.end(err);
                    return;
                });
        } else {
            console.log("Page not found in validSites: \"" + file + "\"");
            res.writeHead(404);
            res.end("Page not found: " + file);
            return;
        }
    };

    Array.prototype.contains = function (tester) {
        for(let i = 0; i < this.length; i++) { 
            console.log(this[i]  + " : " + tester);
            if(this[i] == tester){
                console.log("true");
                return true;
            }        
        };
        console.log("false");
        return false;
    }

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}

function getContentType(fileType){
    let temp = "text/";
    if(fileType == "js"){
        temp += "javascript";
    } else {
        temp += fileType;
    }
    console.log("temp: " + temp);
    return temp;
}
