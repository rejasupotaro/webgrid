var socket = io.connect('http://localhost:3000');

socket.on('connect', function() {
  socket.on('message', function(message) {
    if (message.hasOwnProperty('contents')) {
      var contents = message.contents;
      var pageContainer = document.getElementById("page-container");
      pageContainer.innerHTML = contents;
    }
  });

});

// 指定されたコンテンツをサーバーに要求する
function getContents(contents) {
  socket.emit('message', { page: contents });
}

function showProperties(obj) {
  var s = "";
  for (var i in obj) {
    s += i + ",";
  }
  s = s.substring(0, s.length - 1);
  console.log(s);
}
