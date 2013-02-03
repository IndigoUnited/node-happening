'use strict';

var expect    = require('expect.js');
var Happening = require(__dirname + '/../index');
var async     = require('async');

module.exports = function (create) {
    describe.only('#emit()', function () {
        this.timeout(4000);
        it('should invoke the callback', function (done) {
            var emitter = create(function () {
                emitter.on('foo', done);
                emitter.emit('foo');
            });
        });

        it('should pass arguments to the callbacks', function (done) {
            var emitter = create(function () {
                emitter.on('foo', function (a, b) {

                    expect(a).to.eql('bar');
                    expect(b).to.eql('baz');
                    done();
                });

                emitter.emit('foo', 'bar', 'baz');
            });
        });
    });
};