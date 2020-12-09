// Socket Message Handler
class MessageHandler {
  
  constructor(io) {
    this.io = io;
    this.msgs = [];
  }

  connect() {
    const io = this.io.sockets;
    const that = this;

    io.on('connection', function (socket) {
      console.log('Client connected', { client_id: socket.client.id });

      // Emit to ALL clients
      io.emit('msg', '[connected] ' + socket.client.id);

      // Emit to client
      that.msgs.forEach(msg => {
        socket.emit('msg', msg);  
      });

      socket.on('msg', function (data) {
        const msg = '[' + data.name + '] ' + data.msg;

        console.log(msg);

        // Emit to other clients
        socket.broadcast.emit('msg', msg);
        
        // Emit to client
        socket.emit('msg', msg);

        // Save last 10 msgs
        that.msgs.unshift(msg);
        that.msgs = that.msgs.slice(0, Math.min(that.msgs.length, 10));
      });
    });
  }
};

module.exports = function(io) { 
  return new MessageHandler(io);
};