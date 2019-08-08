
const path = require('path');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    path: `./specs.csv`,
    header: ['value', 'synonyms']
});

let result = [];

for (let i = 1; i <= 100; i++) {
  let toMerge = require(__dirname + `/data/${i}.json`);
  toMerge.specs.forEach((spec) => {
    let counter = 0;
    let row = []
    row.push('"' + spec.title + '"');
    row.push('"' + spec.title + '"');
    result.push(row);
  })
// fs.writeFileSync(`./entity${i}.json`, JSON.stringify(obj));
}  
csvWriter.writeRecords(result).then(() => {
  console.log('done');
})

// console.log(result);

