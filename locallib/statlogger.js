const fs = require('fs');
const { exit } = require('process');
const stats = require('./stats.js');


var dir = `../stats/`;


//if stats directory doesnt exists add
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    fs.writeFileSync(`${dir}stats.stats`, '[]');
}

var before = new Date().getTime() //get current time
var filenamedate = new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear();
var date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

console.log('Logging stats.')

var files = stats.totalFiles()

stats.totalSize.then(size => {

    var statsarray;

    var data = {
        date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
        chartdate: date.slice(0, -17),
        totalSize: size,
        totalFiles: files.totalFiles.length,
    }

    var statsarray = fs.readFileSync(`${dir}stats.stats`, {encoding:'utf8', flag:'r'});
    var statsarray = JSON.parse(statsarray);

    if(statsarray.length == 12){
        statsarray.pop();
    };

    statsarray.push(data);

    fs.writeFile(`${dir}stats.stats`, JSON.stringify(statsarray), (err) => {
        if (err) {throw err}
        var after = new Date().getTime() - before
        console.log(`Done! took ${after}ms`);
        exit();
    })


})
    .catch(err => console.log(`Error saving stats, ${err}`))






