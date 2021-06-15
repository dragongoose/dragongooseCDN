const fs = require('fs');
const { exit } = require('process');
const stats = require('./stats.js');


var dir = `../stats/`;


//if stats directory doesnt exists add
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var before = new Date().getTime() //get current time
var filenamedate = new Date().getMonth() + '_' + new Date().getDate() + '_' + new Date().getFullYear();
var date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })

console.log('Logging stats.')

var files = stats.totalFiles()

stats.totalSize.then(size => {
    console.log(size)
    var data = {
        date: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
        chartdate: date.slice(0, -17),
        totalSize: size,
        totalFiles: files.totalFiles.length,
    }
    
    fs.writeFile(`${dir}${filenamedate}.stats`, JSON.stringify(data), (err) => {
        if(err) return console.log('ERROR WHILE SAVING STATS:')
        var after = new Date().getTime() - before
        console.log(`Done! took ${after}ms`);
        exit();
    })
})
.catch(err => console.log(`Error saving stats, ${err}`))






