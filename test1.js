'use strict';

var Happening = require('./index');



var emitter1 = Happening.create({name: 'emitter1'}, function () {
    console.log('emitter1 started');
    // add listener
    emitter1.on('foo2', function () {
        done1();
    });

    // emit event
    emitter1.emit('foo2');
});

function done1() {
    console.log('------------ done1!');


    var emitter2 = Happening.create({name: 'emitter2'}, function () {
        console.log('emitter2 started');
        // add listener
        emitter2.on('foo', function (a, b) {

            console.log('got called back with', a, b);

            done2();
        });

        // emit event
        emitter2.emit('foo', 'bar', 'baz');
    });
}

function done2() {
    console.log('------------ done2!');
}