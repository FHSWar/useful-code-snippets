const static = require('node-static');
const http = require('http');

const distFolder = new static.Server('./dist');
const port = 8008;

http.createServer(function (req, res) {
  // distFolder.serve(req, res);
  distFolder.serve(req, res, function (err, result) {
    // Fallback for history mode
    if (err !== null && err.status === 404) {
      // 入口页不命名为index.html会导致加载不到图片，在回落里面从新指向正确的入口页就可以了
      distFolder.serveFile('/wow.html', 200, {}, req, res);
      // console.log('err', err, '\nreq.url', req.url)
    }
  });
}).listen(port, () => {
  console.log('Server listening on: http://localhost:%s', port)
})