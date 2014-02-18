'use strict';

var Happening = require('./index');

var emitter1 = Happening.create(function (err) {
    if (err) {
        throw err;
    }

    var i1 = 0;

    emitter1.on('test', function () {
        console.log(Array.prototype.slice.apply(arguments));

        emitter1.stop(function () {


            var emitter2 = Happening.create(function (err) {
                if (err) {
                    throw err;
                }

                var i2 = 0;

                emitter2.on('test', function () {
                    console.log(Array.prototype.slice.apply(arguments));
                });

                emitter2.emit('test', 'emitter2', i2++);

            });

        });
    });

    emitter1.emit('test');
});