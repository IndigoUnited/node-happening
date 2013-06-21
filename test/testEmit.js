/*global describe, it*/

'use strict';

var expect    = require('expect.js');
var Happening = require(__dirname + '/../index');
var async     = require('async');

module.exports = function (create) {
    describe.only('#emit()', function () {




        it('should invoke the callback', function (done) {
            var emitter = create(function () {
                // add listener
                emitter.on('foo2', function () {
                    done();
                });

                // emit event
                emitter.emit('foo2');
            });
        });



        it('should pass arguments to the callbacks', function (done) {
            var emitter = create(function () {
                // add listener
                emitter.on('foo', function (a, b) {

console.log('got called back with', a, b);

                    expect(a).to.eql('bar');
                    expect(b).to.eql('baz');
                    done();
                });

                // emit event
                emitter.emit('foo', 'bar', 'baz');
            });
        });




    });
};