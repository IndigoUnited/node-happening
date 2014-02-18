/*global describe, it*/

'use strict';

var expect    = require('expect.js');
var Happening = require(__dirname + '/../index');
var async     = require('async');

module.exports = function (create) {
    describe.only('#emit()', function () {


//        this.timeout(5000);

        it('should invoke the callback', function (done) {
            var emitter = create({
                namespace: Math.random().toString()
            }, function () {
                // add listener
                emitter.on('foo', function () {

                    expect(arguments.length).to.eql(0);

                    done();
                });

                // emit event
                emitter.emit('foo');
            });
        });



        it('should pass arguments to the callbacks', function (done) {
            var emitter = create({
                namespace: Math.random().toString()
            }, function () {
                // add listener
                emitter.on('foo', function (a, b) {
                    expect(a).to.eql('bar');
                    expect(b).to.eql('baz');
                    done();
                });

                // emit event
                emitter.emit('foo', 'bar', 'baz');
            });
        });


        it('should invoke the callback on both listeners');

        it('should invoke the callback of the correct event');
    });
};