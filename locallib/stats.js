const fs = require("fs")
const path = require("path")
const getSize = require('get-folder-size');

const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(file)
    }
  })

  return arrayOfFiles;
}

const getAdvFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAdvFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(__dirname, '../' ,dirPath, "/", file))
      }
    })
  
    return arrayOfFiles
  }

function getUploadKey(filename, arrayOfFiles) {
    var i;
    var array = new Array;
    var num = new Array;
    console.log(`NAME: ${filename}`)
    for (i = 0; i < arrayOfFiles.length; i++) {
        var a = arrayOfFiles[i].split("\\");
        var b = arrayOfFiles[i].split("/");
        array.push(a);
        array.push(b);

    }
    for (i = 0; i < array.length; i++) {
      console.log(array[i])
        if(array[i].indexOf(filename) != -1){
            num.push(array[i][array[i].indexOf(filename) - 1])
        }
    }
    console.log(num)
    return num;
  }


const totalSize = new Promise((resolve, reject) => {
  var a = {}

  getSize('../uploads/', (err, size) => {
    if (err) {reject(err); throw err}
    a.size = size
  })

  setInterval(() => {
    if(a.size !== undefined){
      return resolve(a.size);
    } else {
      console.log('nope')
    }
  }
  ,15)

})


/*
function totalSize() {

    getSize('../uploads/', (err, size) => {
        if (err) {throw err} else {
          a.size = size;
        }     
    });

    console.log(a)

}
*/

function totalFiles() {
    var filesArray = fs.readdirSync("../uploads")
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
        var returnArray = getAllFiles('../uploads/');

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
module.exports.getAllFiles = getAllFiles;
module.exports.getAdvFiles = getAdvFiles;
module.exports.getUploadKey = getUploadKey;
module.exports.totalFiles = totalFiles;
module.exports.totalSize = totalSize;