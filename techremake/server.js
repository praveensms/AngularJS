const express = require('express'),
      app = express(),
      server = require('http').createServer(app);
      io = require('socket.io')(server);

let timerId = null,
    sockets = new Set();


app.use(express.static(__dirname + '/dist'));

io.on('connection', socket => {

  sockets.add(socket);

  if (!timerId) {
    startTimer();
  }

  socket.on('clientdata', data => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    sockets.delete(socket);
  });

});

function startTimer() {
  timerId = setInterval(() => {
    if (!sockets.size) {
      clearInterval(timerId);
      timerId = null;
      console.log(`Timer stopped`);
    }
    let value = ((Math.random() * 500) + 1).toFixed(2);
    for (const s of sockets) {
      console.log(`The Random value is: ${value}`);
      s.emit('data', { data: value });
    }

  }, 2000);
}

server.listen(8080);
console.log('Visit http://localhost:8080 in your browser');
