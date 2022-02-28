class Ecc {
    constructor(eccId) {
        this.id = eccId;
    }
}










function saveToFile(object) {
    var fs = require('fs');
    fs.writeFileSync("Eccs.txt", JSON.stringify(object), function (err) {
        if (err) {
            console.log("error" + err);
        }
    });
}

function readFromFile() {
    var fs = require('fs');
    var readObjects = JSON.parse(fs.readFileSync("Eccs.txt", function (err) {
        if (err) {
            console.log(err);
        }
    }));
    return readObjects;
}
function test() {
    let registeredEccs = readFromDisk();
    registeredEccs.array.forEach(diskEcc => {
        if (localEcc.id == diskEcc.id) {
            alert("Succesfully fetched your profile");
        }
    });
}




function startHTTP() {
    const https = require('https')

    const data = JSON.stringify({
        todo: 'Buy the milk'
    })

    const options = {
        hostname: 'whatever.com',
        port: 443,
        path: '/todos',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(data)
    req.end()
}