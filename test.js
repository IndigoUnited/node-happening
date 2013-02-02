var Happening = require('./index');

var happening = Happening.create(function (err) {
    if (err) {
        throw err;
    }
    
    happening.on('my_event', function (param1, param2) {
        console.log('my event got called with', param1, param2);
    });

    happening.emit('my_event', 'happening', 'stuff');
});

setInterval(function () {
    console.log('still here');
}, 500);
