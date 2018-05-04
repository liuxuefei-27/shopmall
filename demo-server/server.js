let http = require('http');
let url = require('url');
let util = require('util');
let fs = require('fs');

http.createServer((req,res)=>{
  var pathname = url.parse(req.url).pathname.substring(1);
  fs.readFile(pathname,(err,data)=>{
    if(err){
      res.writeHead(404,{
        'Content-Type':'text/html'
      });
    }else{
      res.writeHead(200,{
        'Content-Type':'text/html'
      });
      res.write(data.toString());
      res.end();
    }
  });
}).listen(3000,"127.0.0.1",()=>{
  console.log("服务器启动成功！请输入网址访问：http://127.0.0.1:3000");
});
