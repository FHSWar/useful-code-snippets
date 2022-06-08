const fs = require('fs');

const data = fs.readFileSync('message.txt')
const fd = fs.openSync('message.txt', 'w+')
const insert = Buffer.from("text to prepend \n")
fs.writeSync(fd, insert, 0, insert.length, 0)
fs.writeSync(fd, data, 0, data.length, insert.length)
fs.close(fd, (err) => {
  if (err) throw err;
});