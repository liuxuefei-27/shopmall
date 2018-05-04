let User = require('./User');
console.log(`${User.sayHello()},good afternoon ${User.userName}`);

let http = require('http');
let url = require('url');
let util = require('util');

http.createServer((req,res)=>{
  res.statusCode = 200;
  res.setHeader("Content-Type","text/plain;charset=utf-8");
  res.end(`Hello,node.js.${util.inspect(url.parse("http://127.0.0.1:3000/demo.html?userId=123"))}`);
  console.log(`url:${req.url}`);
  console.log(`url:${url.parse(req.url)}`);
  console.log(`url:${util.inspect(url.parse(req.url))}`);
}).listen(3000,"127.0.0.1",()=>{
  console.log("服务器已经运行成功！")
});
