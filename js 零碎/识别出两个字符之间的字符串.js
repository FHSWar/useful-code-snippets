const str = 'http://Dujinhua506:password@wula/'

console.log(str.match(/[^:]+(?=@)/g)); // [ 'password' ]