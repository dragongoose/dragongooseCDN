const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const config = require('./config.json');
const fileUpload = require('express-fileupload');
const expressip = require('express-ip');
const path = require('path')
const sh = require('shortid');
const fs = require('fs');
const check = require('./locallib/checks.js')
const stats = require('./locallib/stats')
var morgan = require('morgan')

stats.run()

var date = new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(expressip().getIpInfoMiddleware);
app.use(morgan({stream: fs.createWriteStream('./logs/' + date + 'access.log', {flags: 'a'})}));
app.use(morgan('dev'));

app.use('/',express.static(__dirname + '/uploads'));
app.use('/uploads',express.static(__dirname + '/uploads'));
app.use('/',express.static(__dirname + '/css'))
app.use('/',express.static(__dirname + '/html'));
app.use('/assets',express.static(__dirname + '/assets'));

//url shorten
app.post('/short', function (req, res) {
    console.log(req.body)
});

app.get('/uploads/:tag' , function (req , res) {
  res.send("tagId is set to " + req.params.tagId);
});


app.get('/test', function (req,res) {
    res.send('hi')
})


app.post('/upload', function (req, res) {
    
    let sampleFile = req.files.sampleFile;
  	let fileExtension = checks.getExtension(sampleFile.name)
  	let filename = sh.generate() + "." + fileExtension;
	
	// check if apikey is valid
  	if(!config.api_key.includes(req.header("api_key"))){
      	return res.sendStatus(401).send('Invalid api key');
  	}
  
    if(check.meetCriteria(req.files.sampleFile).msg !== 'ok'){
        return res.status(check.meetCriteria(req.files.sampleFile).code).send(check.meetCriteria(req.files.sampleFile).msg)
    }
    
    if(check.ipCheck(req.ipInfo.ip).msg !== 'ok'){
        return res.status(check.ipCheck(req.ipInfo.ip).code).send(check.ipCheck(req.ipInfo.ip).msg)
    }
    
    sampleFile.mv(__dirname + '/uploads/' + '/' + req.header("api_key") + '/' + filename, function (err) {
      if (err) return res.status(500).send(err);

      res.send(`https:${req.get('host')}/${req.header('api_key')}/${filename}`);
  });
});

// Give Index.html for visitors
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/main.html');
});


//404 error
app.use( function(req, res, next) {
    res.status(404)
    res.sendFile('./error/404.html', {root: __dirname });
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})