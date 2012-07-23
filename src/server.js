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

// socket event handling
var io = webgrid.listen(app)
io.sockets.on('connection', function(socket) {
  webgrid.setSocketEvent(socket)
})
