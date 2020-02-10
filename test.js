const fs = require('fs');

const file = JSON.parse(fs.readFileSync('accs.json'));
console.log(file);