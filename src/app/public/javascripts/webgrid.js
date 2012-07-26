function createWebGrid(a) {
  var address = a || "http://localhost:3000"
  var socket = io.connect(address)

  var taskProgress = 0
  var connectionCount = 1
  var taskPoint = 0

  var taskReceiver = function(task, callback) { callback(task) }
  var resultReceiver = function(result) { socket.emit(result) }

  var worker = new Worker("/javascripts/background.js")
  var isWorkable = true
  worker.onmessage = function(event) {
    var result = resultReceiver(event.data)
    taskPoint += result.result.length

    socket.emit("sendResult", result)

    if (isWorkable) requestTask()
  }

  function setText(elem, text) {
    if (elem.innerText) {
      elem.innerText = text
    } else {
      elem.textContent = text
    }
  }

  socket.on("connect", function() {
    socket.on("task", function(task) {
      taskReceiver(task, function(task) {
        worker.postMessage(task)
      })
    })

    socket.on("info", function(info) {
      taskProgress = info.taskProgress
      connectionCount = info.connectionCount

      var taskProgressText = "task progress: " + taskProgress * 100 + "%" 
      setText($("#taskProgress")[0], taskProgressText)

      var connectionCountText = "connection count: " + connectionCount
      setText($("#connectionCount")[0], connectionCountText)

      var taskPointText = "your points: " + taskPoint + "pt"
      setText($("#point")[0], taskPointText)
    })
  })

  return {
    setIsWorkable: function(workable) {
      isWorkable = workable
    },

    socket: socket,

    getTaskProgress: function() {
      return taskProgress
    },

    setTaskReceiver: function(func) {
      taskReceiver = func
    },

    setResultReceiver: function(func) {
      resultReceiver = func
    }
  }
}
