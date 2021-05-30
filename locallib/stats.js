const fs = require("fs")
const path = require("path")
const getSize = require('get-folder-size');
function totalSize() {
    getSize('./uploads/', (err, size) => {
        if (err) { throw err; }
        console.log(size)

    });

}

function totalFiles() {
    var filesArray = fs.readdirSync("./uploads")
    var ok = {
        'run': 'true'
    };

    try {
        ok.totalFiles = [];

        const getAllFiles = function(dirPath, arrayOfFiles) {
            files = fs.readdirSync(dirPath)
          
            arrayOfFiles = arrayOfFiles || []
          
            files.forEach(function(file) {
              if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
              } else {
                arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
              }
            })
          
            return arrayOfFiles
        }
        var returnArray = getAllFiles('./uploads/');

        ok.totalFiles = returnArray.toString().split(',');
        ok.run = 'true';

    } catch (e) {
        console.log(e);
        ok.run = 'false';
        return (ok)
    }

    if (ok.run == 'true') return (ok);
}

function run() {
    var total = totalFiles()
    if (total.run == 'true') {
        console.log(total.totalFiles.length)
        console.log(totalSize())
    } else {
        console.log('error')
    }


}


module.exports.run = run;
