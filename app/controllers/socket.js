module.exports = function(io) {
    io.sockets.on('connection', function(socket) {
        socket.on('getInsightResult', function() {
            socket.emit('getInsightResult', {hello: 'world'});
        });

        socket.on('setInsightsResult', function(data) {
            console.log(data);
        });
    });
};