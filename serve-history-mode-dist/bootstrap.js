const static = require('node-static');
const http = require('http');

const distFolder = new static.Server('./dist');
const port = 8008;

http.createServer(function (req, res) {
  // distFolder.serve(req, res);
  distFolder.serve(req, res, function (err, result) {
    // Fallback for history mode(浏览器要配合开启disable cache嗷)
    if (err !== null && err.status === 404) {
      console.log('没有对应文件路径的资源', '\nreq.url', req.url) // 'err', err
      // 入口页不命名为index.html会导致加载不到图片，在回落里面从新指向正确的入口页就可以了
      distFolder.serveFile('wow.html', 200, {}, req, res);
    }
  });
}).listen(port, () => {
  console.log('Server listening on: http://localhost:%s', port)
})