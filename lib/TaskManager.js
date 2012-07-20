var EventEmitter = require('events').EventEmitter
var jsp = require("uglify-js").parser
var pro = require("uglify-js").uglify
var taskArray = new Array()
var taskIndex = 0;
var funcArray = new Array()
var StopWatch = require('./StopWatch')
var stopWatch = new StopWatch()

function TaskManager() {}

TaskManager.prototype = new EventEmitter()

function getFuncName(func) {
  return arguments[0].name
}

TaskManager.prototype.addTask = function(func, args) {
  var funcName = getFuncName(func)

  if (!funcArray[funcName]) {
    var origCode = func.toString()
    var ast = jsp.parse(origCode)
    ast = pro.ast_mangle(ast)
    ast = pro.ast_squeeze(ast)
    var finalCode = pro.gen_code(ast)

    var splitedCode = finalCode.split(" ")
    splitedCode.shift()
    var head = splitedCode[0].replace(/^.*\(\){/m, ' {')
    splitedCode[0] = head
    var funcStatement = splitedCode.join(" ")

    funcArray[funcName] = funcStatement
  }

  var task = {
    id: taskIndex++,
    funcName: funcName,
    args: args,
    state: "wait"
  }

  taskArray.push(task)
}

function getResult() {
  var result = new Array()
  for (var i = 0; i < taskArray.length; i++) {
    Array.prototype.push.apply(result, taskArray[i].result);
  }
  return result
}

var getWaitTask = function() {
  stopWatch.start()
  getWaitTask = _getWaitTask
  return getWaitTask()
}

function _getWaitTask() {
  for (var i = 0; i < taskArray.length; i++) {
    if (taskArray[i].state == "wait") {
      var task = taskArray[i]
      task.func = funcArray[task.funcName]
      return task
    }
  }
  return null
}

TaskManager.prototype.getTask = function(callback) {
  var task = getWaitTask() 
  if (task != null) {
    callback(task)
  } else {
    console.log(stopWatch.stop())
    this.emit('done', getResult())
  }
}

TaskManager.prototype.setResult = function(result) {
  for (var i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id == result.id) {
      taskArray[i].result = result.result
      taskArray[i].state = "done"
    }
  }
}

function countWaitTask() {
  var waitTaskCount = 0
  for (var i = 0; i < taskArray.length; i++) {
    if (taskArray[i].state == "wait") {
      waitTaskCount++
    }
  }
  return waitTaskCount 
}

TaskManager.prototype.getTaskProgress = function() {
  return (taskArray.length - countWaitTask()) / taskArray.length
}

module.exports = TaskManager 
