// Socket Message Handler
class MessageHandler {
  
  constructor(io) {
    this.io = io;
  }

  connect() {
    const io = this.io.sockets;
    
    io.on('connection', function (socket) {
      console.log('client connected', { client_id: socket.client.id });

      // Emit to ALL clients
      io.emit('msg', '[connected] ' + socket.client.id);

      socket.on('msg', function (data) {
        console.log('msg', { data });
        // Emit to other clients
        socket.broadcast.emit('msg', '[' + socket.client.id + '] ' + data);
        // Emit to cient
        socket.emit('msg', '[me] ' + data);
      });
    });
  }
};

module.exports = function(io) { 
  return new MessageHandler(io);
};