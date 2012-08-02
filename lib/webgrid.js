var fs = require('fs')
var env = process.env.NODE_ENV || 'development'
var express = module.exports = require('express')
var path = require('path')
var appDir = ""
var TaskManager = require('./TaskManager')
var taskManager = new TaskManager()
var exec = require('child_process').exec
var serverLoad = 0
var connectionCount = 0

module.exports.createApp = function(baseDir) {
  var app = express.createServer()
  appDir = baseDir + '/app'

  app.configure(function() {
    app.set('base_dir', appDir)
    app.set('public', app + '/public')
    app.set('views', appDir + '/views')
    app.set('view engine', 'jade')

    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.static(appDir + '/public'))
  })

  //periodicExecCommand()

  return app
}

module.exports.compileView = function(page) {
  var fs = require('fs')
  var filePath = appDir + '/views/' + page + '.jade'
  var data = fs.readFileSync(filePath, 'utf8')
  var jade = require('jade')
  var func = jade.compile(data)

  return func()
}

module.exports.listen = function(app) {
  var config = require(appDir + '/config/' + env)
  var wsServerAddress = config.wsServerAddress || "http://localhost:3000"
  var port = config.port || 3000
  var logLevel = config.logLevel || 1

  var infile = appDir + "/public/javascripts/index.js"
  var outfile = infile
  var dat = ''
  fs.readFileSync(infile).toString().split('\n').forEach(function (line) {
    var newLine = line.replace(/#__ADDRESS__/, wsServerAddress)
    dat = dat + newLine + '\n'
  })  
  fs.writeFile(outfile, dat)

  // task setup
  var task = require(appDir + '/task')
  task.main(appDir)
  taskManager.on('done', function(result) {
    task.onResult(result)
  })  

  app.listen(port)
  console.log('webgrid server running on port: ' + port)

  return require('socket.io').listen(app, {'log level': logLevel})
}

module.exports.setSocketEvent = function(socket) {
  connectionCount++
  var self = this
  
  socket.on('requestTask', function() {
    taskManager.getTask(function(task) {
      socket.emit('task', task)
    })
  })

  socket.on('sendResult', function(result) {
    taskManager.setResult(result)
  })

  socket.on('requestView', function(view) {
    var view = webgrid.compileView(view)
    if (view) {
      socket.emit('view', view)
    }
  })

  socket.on('requestInfo', function() {
    var info = {
      connectionCount: connectionCount,
      taskProgress: taskManager.getTaskProgress(),
      serverLoad: serverLoad 
    }
    socket.emit('info', info)
  })

	socket.on('disconnect', function() {
    connectionCount--
	})
}

function periodicExecCommand() {
  setInterval(function() {
    var command = 'uptime | cut -d " " -f 11'
    exec(command, function(err, stdout, stderr) { 
      serverLoad = stdout.substring(0, stdout.length - 2)
    })
    console.log("serverLoad: " + serverLoad)
  }, 2000)
}
