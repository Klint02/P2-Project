host();

const validSites = ["/",
                    "/Pages/ECC/ecc.html",
                    "/Pages/ECC/ecc.js",
                    "/Pages/ECC/ecc.css"
                ]

function host(){
    const http = require("http");
    const fs = require('fs').promises;
    const host = 'localhost';
    const port = 8000;
    const requestListener = function (req, res) {
        const temp = req.url.toString().split('?');
        let file = temp[0];
        const arguments = temp[1];
        console.log("FILE: " + file);
        if(validSites.contains(file)){
            if(file == "/"){
                file = "/index.html"
            }
            file = file.substring(1);
            
            fs.readFile(file)
                .then(contents => {
                    res.setHeader("Content-Type", "text/html");
                    res.writeHead(200);
                    res.end(contents);
                })
                .catch(err => {
                    console.log("Page does not exist in file system");
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
            if(this[i] == tester){
                return true;
            }        
        };
        return false;
    }

    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Server is running on http://${host}:${port}`);
    });
}