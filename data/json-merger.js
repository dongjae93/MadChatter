const path = require('path');
const fs = require('fs')

let result = [];
for (let i = 1; i <= 100; i++) {
  let toMerge = require(`./${i}.json`);
  // console.log(toMerge);
  result.push(toMerge);
}
// console.log(result);

fs.writeFileSync('./data/products.json', JSON.stringify(result));
