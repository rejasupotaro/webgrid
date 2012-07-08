var fs = require('fs')
var env = process.env.NODE_ENV || 'development'
var express = module.exports = require('express')
var path = require('path')
var appDir = ""
var TaskManager = require('./taskManager')
var taskManager = new TaskManager()
var exec = require('child_process').exec

module.exports.createApp = function(baseDir) {
  var app = express.createServer()
  appDir = baseDir + '/app'

  app.configure(function() {
    app.set('base_dir', appDir);
    app.set('public', app + '/public');
    app.set('views', baseDir + '/app/views');
    app.set('view engine', 'jade');

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(baseDir + '/app/public'));
  })

  return app;
}

module.exports.compileView = function(baseDir, page) {
  var fs = require('fs')
  var filePath = appDir + '/views/' + page + '.jade'
  var data = fs.readFileSync(filePath, 'utf8')
  var jade = require('jade')
  var func = jade.compile(data)

  return func()
}

module.exports.listen = function(app) {
  var config = require(appDir + '/config/' + env)
  var port = config.port || 3000
  var logLevel = config.logLevel || 1

  // task setup
  var main = require(appDir + '/task').main()
  taskManager.on('done', function(result) {
    main.result(result)
  })

  app.listen(port)
  console.log('webgrid server running on port: ' + port)

  return require('socket.io').listen(app, {'log level': logLevel})
}

module.exports.getTask = function(callback) {
  return taskManager.getTask(callback)
}

module.exports.setResult = taskManager.setResult
module.exports.getTaskProgress = taskManager.getTaskProgress

module.exports.getServerLoad = function(callback) {
  var command = 'uptime | cut -d " " -f 11'
  exec(command, function(err, stdout, stderr) { 
    callback(stdout.substring(0, stdout.length - 2))
  })
}

