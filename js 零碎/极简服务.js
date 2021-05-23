/*
 * @Author: FHSWar
 * @Date: 2021-05-10 16:34:49
 * @Last Edit Time: Do not edit
 */
"use strict";
const http = require("http")
const server = http.createServer()
server.on("request", function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/plain; charset=utf-8"
	});
	if (req.url.startsWith("/index")) {
		res.write("首页")
		res.end();
	} else if (req.url.startsWith("/login")) {
		res.end("登录")
	} else {
		res.end("没有数据")
	}
});
server.listen(3000);