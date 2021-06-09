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
var morgan = require('morgan');
const { ENOENT } = require('constants');
const { dirname } = require('path');

stats.run()

var date = new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(expressip().getIpInfoMiddleware);
app.use(morgan({ stream: fs.createWriteStream('./logs/' + date + 'access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

app.use('/', express.static(__dirname + '/css'))
app.use('/', express.static(__dirname + '/html'));
app.use('/assets', express.static(__dirname + '/assets'));

//url shorten
app.post('/short', function (req, res) {
  console.log(req.body)
});

app.get('/watch', function (req, res) {
  res.sendFile(`${__dirname}/html/watch.html`)
});

app.get('/video/:id', (req, res) => {
  try {
    var fiels = stats.getAllFiles('./uploads', [])
    if (fiels.indexOf(req.params.id) == -1) return res.sendFile(`${__dirname}/assets/video/unk.mp4`);
    var fullfiels = stats.getAdvFiles('./uploads', [])
    let key = stats.getUploadKey(req.params.id, fullfiels)

    const range = req.headers.range;
    const videoPath = `./uploads/${key}/${req.params.id}`;
    console.log(`AAAA:${key}`);
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 1000000
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + chunkSize, videoSize - 1);

    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, { start, end })
    stream.pipe(res);
  } catch (e) {
    console.log(e)
    res.status(404).sendFile('./error/404.html', { root: __dirname });
  }

});

app.get('/tts/:tag', function (req, res) {
  console.log(req.params.tag)
})

app.get('/uploads/:tag', function (req, res) {

  var fiels = stats.getAllFiles('./uploads', [])
  var fullfiels = stats.getAdvFiles('./uploads', [])
  let key = stats.getUploadKey(req.params.tag, fullfiels)
  let fileExtension = check.getExtension(req.params.tag)

 


  if (fiels.indexOf(req.params.tag) != -1) {
    
    if(fileExtension != 'mp4'){
      res.sendFile(`${__dirname}/uploads/${key}/${req.params.tag}`)
    } else {
      //
    }

  } else {

    res.send('no')

  }

});


app.get('/test', function (req, res) {
  res.send('hi')
})


app.post('/upload', function (req, res) {

  console.log(req)

  let sampleFile = req.files.sampleFile;
  let fileExtension = check.getExtension(sampleFile.name)
  let filename = sh.generate() + "." + fileExtension;

  // check if apikey is valid
  if (!config.api_key.includes(req.header("api_key"))) {
    return res.sendStatus(401).send('Invalid api key');
  }

  if (check.meetCriteria(req.files.sampleFile).msg !== 'ok') {
    return res.status(check.meetCriteria(req.files.sampleFile).code).send(check.meetCriteria(req.files.sampleFile).msg)
  }

  if (check.ipCheck(req.ipInfo.ip).msg !== 'ok') {
    return res.status(check.ipCheck(req.ipInfo.ip).code).send(check.ipCheck(req.ipInfo.ip).msg)
  }

  sampleFile.mv(__dirname + '/uploads/' + req.header("api_key") + '/' + filename, function (err) {
    if (err) return res.status(500).send(err);

    if(fileExtension == "mp4"){
      res.send(`https://${req.get('host')}/watch?id=${filename}`)
    } else {
      res.send(`https://${req.get('host')}/uploads/${filename}`);
    }
  });
});

// Give Index.html for visitors
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/main.html');
});


//404 error
app.use(function (req, res, next) {
  res.status(404)
  res.sendFile('./error/404.html', { root: __dirname });
});

app.listen(config.port, () => {
  console.log(`App listening at ${config.port}`)
})