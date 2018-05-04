let http = require('http');
let util = require('util');
http.get('http://nodejs.org/dist/index.json', (res) => {
  let nodeData = '';
  res.on('data', (chunk) => {
    nodeData += chunk;
  });
  res.on('end', () => {
    let result = JSON.parse(nodeData);
    console.log(`result:${util.inspect(result)}`);
  });
}).on('error', (err) => {
  console.error(`错误: ${err.message}`);
});
