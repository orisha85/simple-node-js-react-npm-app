var express = require('express'); 
var server = express(); 
var options = { index: 'public/index.html' };  // Adjusted path to public/index.html
server.use('/', express.static('/home/site/wwwroot', options)); 
server.listen(process.env.PORT);