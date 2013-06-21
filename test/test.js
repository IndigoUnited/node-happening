/*global describe, afterEach*/

'use strict';

var Happening  = require(__dirname + '/../index');
var testCreate = require('./testCreate');
var testEmit   = require('./testEmit');

// array of emitters that are fabricated by tests, and need to be stopped when
// the test stops
var emitters = [];

// factory method that creates emitters but keeps a list of instances, for clean
// up
function create() {
    var opt;
    var callback;

    if (arguments.length === 1) {
        opt      = {};
        callback = arguments[0];
    } else {
        opt      = arguments[0];
        callback = arguments[1];
    }

    var emitter = Happening.create(opt, function (err) {
        if (!err) {
            emitters.push(emitter);
        }

        callback(err);
    });

    return emitter;
}

// clean up method that runs after each execution of a test case
function cleanUp(done) {
    // var totalStopped = 0;

    // // stop each of the emitters
    // emitters.forEach(function (emitter) {
    //     emitter.stop(function (err) {
    //         if (err) {
    //             return done(err);
    //         }

    //         ++totalStopped;

    //         // if the last emitter was stopped
    //         if (totalStopped === emitters.length) {
    //             // reset list and callback
    //             emitters = [];
    //             done();
    //         }
    //     });
    // });
    done();
}


describe('Happening', function () {
    testCreate(create);

    testEmit(create);

    afterEach(cleanUp);
});

setInterval(function () {
    var mem = process.memoryUsage();

    console.log(new Date(),
        'rss:', (mem.rss / 1024 / 1024).toFixed(2) + 'MB',
        'heapTotal:', (mem.heapTotal / 1024 / 1024).toFixed(2) + 'MB',
        'heapUsed:', (mem.heapUsed / 1024 / 1024).toFixed(2) + 'MB'
    );
}, 10000);

/*
create
    with options
    without options
    2 with different namespaces

test stop()

emit
    to single emitter
    to multiple emitters
        all listeners
        only one listener
        no listeners

once
    should only listen once
    should work separately for separate emitters

removeListener
    should not be a listener

listeners
    should be 0
    should be 5
    after removing 1, should be 4
    after removeAllListeners should be 0


*/