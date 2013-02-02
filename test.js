'use strict';

var Happening = require('./index');

var happening = Happening.create(function (err) {
    if (err) {
        throw err;
    }

    console.log('emitter is now ready to work just like any other emitter');

    happening.on('my_event', function (param1, param2) {
        console.log('my event got called with', param1, 'and', param2);
    });

    var i = 0;
    var interval = 10;
    setInterval(function () {
        happening.emit('my_event', i, i * interval + 'ms');
        ++i;
    }, interval);
    
    

});
