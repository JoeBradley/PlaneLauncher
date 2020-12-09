// Socket Message Handler
class MessageHandler {
  
  constructor(io) {
    this.io = io;
  }

  connect() {
    const io = this.io.sockets;
    
    io.on('connection', function (socket) {
      console.log('Client connected', { client_id: socket.client.id });

      // Emit to ALL clients
      io.emit('msg', '[connected] ' + socket.client.id);

      socket.on('msg', function (data) {
        console.log('[' + data.name + '] ' + data.msg);
        // Emit to other clients
        socket.broadcast.emit('msg', '[' + data.name + '] ' + data.msg);
        // Emit to client
        socket.emit('msg', '[' + data.name + '] ' + data.msg);
      });
    });
  }
};

module.exports = function(io) { 
  return new MessageHandler(io);
};