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
app.use(morgan({ stream: fs.createWriteStream('./logs/' + date + 'access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

app.use('/', express.static(__dirname + '/uploads'));
app.use('/', express.static(__dirname + '/css'))
app.use('/', express.static(__dirname + '/html'));
app.use('/assets', express.static(__dirname + '/assets'));

//url shorten
app.post('/short', function (req, res) {
  console.log(req.body)
});

app.get('/:tag/:tag2', function (req, res) {
  res.redirect('/uploads/:tag/:tag2');
});

app.get('/uploads/:tag/:tag2', function (req, res) {
  try {
    if (fs.existsSync(`./uploads/${req.params.tag}/${req.params.tag2}`)) {
      let fileExtension = check.getExtension(`${__dirname}/uploads/${req.params.tag}/${req.params.tag2}`)
      if (fileExtension == "mp4") {

        const range = req.headers.range;
        const videoPath = './GraphQL.mp4';
        const videoSize = fs.statSync(videoPath).size;

        const chunkSize = 1 * 1e+6;
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

      } else {
        res.sendFile(`${__dirname}/uploads/${req.params.tag}/${req.params.tag2}`);
      }

    } else {

      res.send('The file does not exist.');

    }
  } catch (err) {
    console.error(err);
  }

});


app.get('/test', function (req, res) {
  res.send('hi')
})


app.post('/upload', function (req, res) {

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
app.use(function (req, res, next) {
  res.status(404)
  res.sendFile('./error/404.html', { root: __dirname });
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})