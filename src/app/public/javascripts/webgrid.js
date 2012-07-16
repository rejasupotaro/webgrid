function createWebGrid(a) {
  var address = a || "http://localhost:3000"
  var socket = io.connect(address)

  var taskProgress = 0
  var connectionCount = 1
  var taskPoint = 0

  var isWorkable = true

  var worker = new Worker("/javascripts/background.js")
  worker.onmessage = function(event) {
    taskPoint += event.data.result.length
    console.log(event.data.result)

    socket.emit("sendResult", event.data)

    if (isWorkable) requestTask()
  }

  socket.on("connect", function() {
    socket.on("task", function(task) {
      worker.postMessage(task)
    })

    socket.on("info", function(info) {
      taskProgress = info.taskProgress
      connectionCount = info.connectionCount

      var taskProgressText = "task progress: " + taskProgress * 100 + "%" 
      document.getElementById("taskProgress").innerText = taskProgressText

      var connectionCountText = "connection count: " + connectionCount
      document.getElementById("connectionCount").innerText = connectionCountText

      var taskPointText = "your points: " + taskPoint + "pt"
      document.getElementById("point").innerText = taskPointText
    })
  })

  return {
    setIsWorkable: function(workable) {
      isWorkable = workable
    },

    socket: socket,

    getTaskProgress: function() {
      return taskProgress
    }
  }
}
