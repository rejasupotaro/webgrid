var onResult = function() {}

module.exports.main = function(appDir) {
  var fs = require('fs')

  var infile = appDir + "/task/main.js"
  var outfile = appDir + "/task/.main.js"
  var dat = 'var TaskManager = require("../../node_modules/webgrid/lib/TaskManager")' + '\n' + 'var taskManager = new TaskManager()' + '\n'
  fs.readFileSync(infile).toString().split('\n').forEach(function (line) {
    var newLine = line.replace(/#__PARALLEL__/, "taskManager.addTask")
    dat = dat + newLine + '\n'
  })  
  fs.writeFileSync(outfile, dat)

  var main = require(appDir + '/task/.main')
  onResult = main.onResult

  return main.main()
}

module.exports.onResult = function(result) {
  return onResult(result)
}
