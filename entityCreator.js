
const path = require('path');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const csvWriter = createCsvWriter({
    path: './entities.csv',
    header: ['value', 'synonyms']
});
let result = [];
for (let i = 1; i <= 100; i++) {
  let toMerge = require(__dirname + `/product${i}.json`);
  // console.log(toMerge);
  let arr = []
  arr.push('"' + toMerge.name + '"');
  toMerge.name.split(' ').forEach((keyword) => {
    arr.push('"' + keyword + '"');
  })
  result.push(arr);
  // fs.writeFileSync(`./entity${i}.json`, JSON.stringify(obj));
}

csvWriter.writeRecords(result).then(() => {
  console.log('done');
})
// console.log(result);

