const config = require('./config.json');
const path = require('path');

var exit = {}


function getExtension(filename) {
  var ext = path.extname(filename||'').split('.');
  return ext[ext.length - 1];
};

function meetCriteria(file){
    //let sampleFile = file.sampleFile;
  	let fileExtension = getExtension(file.name)
  	if(config.allowedExtensions.indexOf(fileExtension) == -1){
        exit.code = 403
    	exit.msg = 'File type ' + fileExtension +  ' is not allowed'
      	return(exit);
    }
    
    if(file.size >= 1073741824){
        exit.code = 403
        exit.msg = 'File cant be bigger than 1GB'
        return(exit);
    }
    
    if (!file) {
        exit.code = 400
        exit.msg = 'No files were uploaded.'
        return(exit);
    }
   
	if(exit = {}){
    	exit.msg = 'ok'
    	return(exit);
	};
};

function ipCheck(ip){
    if(config.bannedips.includes(ip)){
        exit.code = 403
    	exit.msg = 'Your ip has been blocked.'
      	return(exit);
    }
    
    if(exit = {}){
    	exit.msg = 'ok'
    	return(exit);
	};
}
    

module.exports.meetCriteria = meetCriteria;
module.exports.ipCheck = ipCheck;