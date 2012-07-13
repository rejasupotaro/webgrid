var webgrid = require('webgrid')
var	app = webgrid.createApp(__dirname)

// server setting
app.configure(function() {
  app.use(webgrid.static(__dirname + '/app/public'))
  app.use(webgrid.errorHandler({ dumpExceptions: true, showStack: true }))
})

// routing
routes = require('./app/routes')
app.get('/', routes.index)
app.get('/admin', routes.admin)


// socket event handling
var io = webgrid.listen(app)
var connectionCount = 0;
io.sockets.on('connection', function(socket) {
  connectionCount++

  socket.on('requestTask', function() {
    webgrid.getTask(function(task) {
			socket.emit('task', task)
		});
  })

	socket.on('sendResult', function(result) {
		webgrid.setResult(result)
	})

  socket.on('requestView', function(view) {
    var view = webgrid.compileView(__dirname, view)
    if (view) {
      socket.emit('view', view)
    }
  })

  socket.on('requestInfo', function() {
    var info = {
      connectionCount: connectionCount,
      taskProgress: webgrid.getTaskProgress(),
      serverLoad: webgrid.getServerLoad()
    }
    socket.emit('info', info)
  })

	socket.on('disconnect', function() {
    connectionCount--
	})
})

/*
process.on('uncaughtException', function(err) {
	console.log('uncaughtException: ' + err)
})
*/
