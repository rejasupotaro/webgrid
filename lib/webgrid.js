var fs = require('fs')
  , express = module.exports = require('express')
  , path = require('path')
  , router = require('./router')

module.exports.createApp = function(baseDir, configuration, options) {
  configuration = configuration || {}
  options = options || {}

  var appDir = baseDir + "/app"
    , app = express.createServer()
 
	app.configure(function() {
    app.set('base_dir', appDir)
    app.set('public', app + '/public')
  	app.set('views', baseDir + '/app/views')
  	app.set('view engine', 'jade')
  
  	app.use(express.bodyParser())
  	app.use(express.methodOverride())
    app.use(express.static(baseDir + '/app/public'))
	})

  return app
}

module.exports.getPageContents = function(baseDir, page) {
  var fs = require('fs');
  var filePath = baseDir + '/app/views/' + page + '.jade';
	var data = fs.readFileSync(filePath, 'utf8');
	var jade = require('jade');
	var func = jade.compile(data);
	console.log('file data: ' + data);

	return { contents: func() };
}

module.exports.listen = function(app) {
	return require('socket.io').listen(app);
}

function showProperties(obj) {
  var s = "";
  for (var i in obj) {
    s += i + ","
  }
  s = s.substring(0, s.length - 1);
  console.log(s);
}
