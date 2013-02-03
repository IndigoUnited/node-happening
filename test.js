'use strict';
//var Happening = require('./index');

//var emitter = Happening.create(function (err) {
var emitter = new (require('events').EventEmitter)();


(function (err) {
    if (err) {
        throw err;
    }

    emitter.on('my_event', function (param1, param2) {
        //console.log('got called with', param1, 'and', param2);
    });

    setInterval(function () {
        emitter.emit('my_event', 'this', 'that');
    }, 500);
})();

var util = require('util');

setInterval(function () {
    var mem = process.memoryUsage();
    console.log(new Date(), 'rss:', (mem.rss / 1024 / 1024).toFixed(2) + 'MB', 'heapTotal:', (mem.heapTotal / 1024 / 1024).toFixed(2) + 'MB', 'heapUsed:', (mem.heapUsed / 1024 / 1024).toFixed(2) + 'MB');
}, 500);