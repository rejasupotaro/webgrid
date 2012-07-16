var TaskManager = require("../../node_modules/webgrid/lib/taskManager")
var taskManager = new TaskManager()

module.exports.main = function() {
  // ブラウザで実行される処理
  function primaryTest() {
    var args = arguments[0]
    var result = new Array()

    for (var i = 0; i < args.length; i++) {
      var num = args[i]
      var flag = true
      var limit = Math.sqrt(num)
      for (var j = 2; j <= limit; j++) {
        if (num % j == 0) {
          flag = false
          break
        }
      }
      if (flag) {
        result.push(num)
      }
    }
    return result
  }

  // ブラウザで実行される処理を登録する
  var dataNum = 1000000
  //var dataNum = 10000
  var range = 1000
  for (var i = 0; i < dataNum / range; i++) {
    var args = new Array();
    for (var j = 0; j < range; j++) {
      var n = i * range + j
      if (n != 0 && n != 1 && n != 2) {
        args.push(n);
      }
    }
    taskManager.addTask(primaryTest, args)
  }

  return this
}

module.exports.result = function(result) {
  console.log('\n---------------------')
  console.log('1000000までの素数のリスト')
  console.log(result.toString())
}
