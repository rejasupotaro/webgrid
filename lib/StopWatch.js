var StopWatch = function() {
  console.log("create StopWatch")
}

StopWatch.prototype.start = function() {
  this.start = new Date()
}

StopWatch.prototype.rap = function() {
  var now = new Date()
  var datet = (now.getTime() - this.start.getTime()) / 1000

  console.log('------------StopWatch-----------')
  console.log('time: ' + datet)
  console.log('--------------------------------')
}

StopWatch.prototype.stop = function() {
  if (!this.datet) { 
    var now = new Date()
    this.datet = (now.getTime() - this.start.getTime()) / 1000
  }

  return this.datet
}

module.exports = StopWatch;
