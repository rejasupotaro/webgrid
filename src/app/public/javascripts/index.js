var webgrid = createWebGrid("http://localhost:3000")


webgrid.setTaskReceiver(function(task, callback) {
  setTimeout(function() {
    callback(task)
  }, 100)
})

webgrid.setResultReceiver(function(result) {
  console.log(result.result)
  return result
})

window.onload = function() {
  termOpen()
  drawGraph()
}

function stopTask() {
  webgrid.setIsWorkable(false)
}

// タスクをサーバーに要求する
function requestTask() {
  webgrid.setIsWorkable(true)
  webgrid.socket.emit('requestTask')
}

// 指定されたコンテンツをサーバーに要求する
function requestContents(view) {
  webgrid.socket.emit('requestView', view)
}

// もろもろの情報をサーバーに要求する
function requestInfo() {
  webgrid.socket.emit('requestInfo')
}

function drawGraph() {
  var n = 10
  var data = d3.range(n).map(function() { return 0 })
 
  var margin = {top: 10, right: 10, bottom: 20, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
  
  var x = d3.scale.linear()
      .domain([0, n - 1])
      .range([0, width]);
  
  var y = d3.scale.linear()
      .domain([0, 1])
      .range([height, 0]);

  var svg = d3.select("#progress").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
  
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

  var line = d3.svg.line()
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); })

  var path =
     svg.append("g")
    .attr("clip-path", "url(#clip)")
    .append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", line)
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  tick();
  
  function tick() {
    requestInfo()

    // push a new data point onto the back
    var taskProgress = webgrid.getTaskProgress() ? webgrid.getTaskProgress() : 0

    data.push(taskProgress);
  
    // redraw the line, and slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(2000)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")")
        .each("end", tick);
  
    // pop the old data point off the front
    data.shift();
  }
}
