function log(data) {
  postMessage({log: data})
}

onmessage = function(event) {
	var task = event.data
	var	func = task.func
	var	args = task.args
  var error = task.error

  if (!error) {
    var func = new Function('args', func)
    task.result = func(args)
  }

  postMessage(task)
}
