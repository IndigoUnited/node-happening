'use strict';

var expect    = require('expect.js');
var Happening = require(__dirname + '/../index');
var async     = require('async');

module.exports = function (create) {
    describe('#create()', function () {
        it('should create a new instance with no options', function (done) {
            var emitter = create(function (err) {
                if (err) {
                    done(err);
                }

                expect(emitter).to.be.a(Happening);

                done();
            });
        });

        it('should create a new instance with empty options', function (done) {
            var emitter = create({}, function (err) {
                if (err) {
                    done(err);
                }

                expect(emitter).to.be.a(Happening);

                done();
            });
        });

        it('should create instances in separate namespaces', function (done) {
            // create two instances in separate namespaces
            async.parallel([
                function (callback) {
                    var emitter = create({
                        namespace: 'first'
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, emitter);
                    });
                },
                function (callback) {
                    var emitter = create({
                        namespace: 'second'
                    }, function (err) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, emitter);
                    });
                }
            ], function (err, emitters) {
                if (err) {
                    done(err);
                }

                var inner_err;

                // subscribe both emitters to same event
                emitters[0].on('event', function (msg) {
                    if (/second/.test(msg)) {
                        inner_err = new Error('Got message from second namespace');
                    }
                });
                emitters[1].on('event', function (msg) {
                    if (/first/.test(msg)) {
                        inner_err = new Error('Got message from first namespace');
                    }
                });

                // emit different messages in both emitters
                emitters[0].emit('event', 'for first namespace');
                emitters[1].emit('event', 'for second namespace');

                setTimeout(function () {
                    done(inner_err);
                }, 500);
            });


        });
    });
};