var Happening = require('./index');

var happening = Happening.create(function (err) {
    if (err) {
        throw err;
    }
    
    happening.on('my_event', function (param1, param2) {
        console.log('my event got called with', param1, param2);
    });
});

setInterval(function () {
    happening.emit('my_event', 'happening', 'stuff');
}, 500);
