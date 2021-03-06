const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const bodyParser = require("body-parser");
const config = require('./config.json');
const fileUpload = require('express-fileupload');
const sh = require('shortid');
const fs = require('fs');
const check = require('./locallib/checks.js');
const stats = require('./locallib/stats.js');
const statlogger = require('./locallib/statlogger.js');
var morgan = require('morgan');
const fileType = require('file-type');
const rateLimit = require("express-rate-limit");
const ejsLint = require('ejs-lint');
var date = new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear();

//log current stats
var CronJob = require('cron').CronJob;
var job = new CronJob('00 00 12 * * 0-6', function() {
  statlogger.run();
  console.log('cronjob')
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  'America/New_York' /* Time zone of this job. */
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 500 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);
app.set('trust proxy', 1); //For Rproxy
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(morgan({ stream: fs.createWriteStream(__dirname + '/logs/' + date + 'access.log', { flags: 'a' }) }));
app.use(morgan('dev'));

app.use('/', express.static(__dirname + '/css'))
app.use('/', express.static(__dirname + '/html'));
app.use('/assets', express.static(__dirname + '/assets'));

app.set('view engine', 'ejs'); //ejs

app.get('/stats/stats.stats', function (req, res) {
  res.sendFile(`${__dirname}/stats/stats.stats`)
});

app.get('/uploads/:tag', function (req, res) {

  var fiels = stats.getAllFiles('./uploads', [])
  var fullfiels = stats.getAdvFiles('./uploads', [])
  let key = stats.getUploadKey(req.params.tag, fullfiels)
  let fileExtension = check.getExtension(req.params.tag)


  if (fiels.indexOf(req.params.tag) != -1) {
    res.sendFile(`${__dirname}/uploads/${key}/${req.params.tag}`)
  } else {
    res.send('invalid id')
  }

});


app.post('/upload', function (req, res) {
  async function main() {

    let sampleFile = req.files.sampleFile;
    const filea = await fileType.fromBuffer(sampleFile.data) //get the filetype from the recieved buffer
    const fileExtension = filea.ext //buffer file type
    let filename = sh.generate() + "." + fileExtension; //new filename for the file.

    // check if apikey is valid
    if (!config.api_key.includes(req.header("api_key"))) {
      return res.sendStatus(401).send('Invalid api key');
    }

    check.meetCriteria(req.files.sampleFile).then(data => {
      if(data.msg != 'ok') return res.sendStatus(data.code).send(data.msg);
    })

    if (check.ipCheck(req.headers['x-forwarded-for']).msg !== 'ok') {
      return res.status(check.ipCheck(req.ipInfo.ip).code).send(check.ipCheck(req.ipInfo.ip).msg)
    }

    sampleFile.mv(__dirname + '/uploads/' + req.header("api_key") + '/' + filename, function (err) {
      if (err) return res.sendStatus(500).send(err);

      var filejson = {};

      const stats = fs.statSync(`${__dirname}/uploads/${req.header('api_key')}/${filename}`);

      filejson.name = filename
      filejson.uploadtime = Date.now();
      filejson.size = stats.size

      res.send(`https://${config.domain}/uploads/${filename}`);

    });

  };
  main()
});

app.get('/upload', function (req, res) {
  res.render(`${__dirname}/html/upload.ejs`, {
    config : config
  })
})

// Give Index.html for visitors
app.get('/', function (req, res) {


  var stat = fs.readFileSync(`${__dirname}/stats/stats.stats`, { encoding: 'utf8', flag: 'r' }); //get saved stats
  var totaljson = {}

  totaljson.total = stats.totalFiles() // add the stats to json

  stats.totalSize.then((asd) => { // ugh, promises

    totaljson.totalsize = asd // more stats

    res.render(`${__dirname}/html/main.ejs`, { // render EJS with the variables
      stats : stat,
      totaljson : totaljson
    })

  })

  console.log(totaljson)



    console.log(req.headers['x-forwarded-for']);
});


//404 error
app.use(function (req, res, next) {
  res.status(404)
  res.sendFile('./error/404.html', { root: __dirname });
});

//SOCKET IO

io.on('connection', function (socket) {

  var stats = fs.readFileSync(`${__dirname}/stats/stats.stats`, { encoding: 'utf8', flag: 'r' });

  socket.emit('chartjson', stats)



  //setInterval(function(){ socket.emit('chartjson', stats) },1000) //send chart data frequently, so the client can update the chart if needed/

  console.log('socket connection');

  
  /* 
   client.on('join', function(data) {
     console.log(data);
   });
   */
});

server.listen(config.port, function () {
  console.log(`Listening on port ${config.port}`)
});
