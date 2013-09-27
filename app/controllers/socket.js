var InsightsResult = require('../../config/db').model('InsightsResult');

module.exports = function(io) {
    InsightsResult.find({}, function(err, data) {
        console.log(data);
    });
    io.sockets.on('connection', function(socket) {
        socket.on('getInsightResult', function() {
            socket.emit('getInsightResult', {hello: 'world'});
        });

        socket.on('setInsightsResult', function(data) {
            var insightsResult = new InsightsResult(),
                resultData = {
                    domain: data.request.url.split(/\//)[2],
                    url: data.request.url,
                    strategy: data.request.strategy,
                    result: data,
                    date: new Date(),
                },
                property;

            for(property in resultData) {
                insightsResult[property] = resultData[property];
            }

            insightsResult.save(function(err) {
                console.log(err);
            });
        });
    });
};