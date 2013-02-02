'use strict';

var One          = require('1');
var EventEmitter = require('events').EventEmitter;
var uuid         = require('node-uuid');

var Happening = function (opt) {
    opt = opt || {};

    // setup cluster
    var oneOpt = {
        cluster: opt.id ? opt.id : uuid.v4(),
        service: 'happening'
    };
    this._one         = new One(oneOpt);
    // obj below holds a list with all the channels that are subscribed
    this._subChannels = {};

    this._emitter = new EventEmitter();

    // flag that controls if the service is running
    this._running = false;
};

Happening.prototype.start = function (cb) {
    var one = this._one;

    var that = this;

    // join cluster,
    this._one.join(function (err) {
        if (err) {
            return cb(err);
        }

        // start advertising service
        one.startAdvertise(function (err) {
            if (err) {
                return cb(err);
            }

            // listen to messages coming from cluster, and treat them as events
            one.on('message', function (chan, msg) {
 console.log('got', msg, 'on', chan);
                var emitter = that._emitter;
                // chan is the event type, and the msg is the callback params
                emitter.emit.apply(chan, JSON.parse(msg));
            });

            // mark emitter as running
            that._running = true;
            cb();
        });
    });
};

Happening.prototype.stop = function (cb) {
    var one = this._one;

    // leave the cluster
    one.leave(function (err) {
        cb(err);
    });

    // mark emitter as not running
    this._running = false;
};

// ------------------------- EventEmitter methods ------------------------------

Happening.prototype.addListener = Happening.prototype.on = function () {
    var emitter   = this._emitter;
    var eventType = arguments[0];

    this._one.subscribe(eventType);
    this._subChannels[eventType] = null; // mark channel as subscribed

    return emitter.on.apply(emitter, arguments);
};

Happening.prototype.once = function () {
    // TODO: handle the once in terms of cluster

    this._emitter.once.apply(this._emitter, arguments);
};

Happening.prototype.removeListener = function () {
    var emitter = this._emitter;
    var eventType = arguments[0];

    var result  = emitter.removeListener.apply(emitter, arguments);

    // if there are no more listeners for the event type
    if (!emitter.listeners().length) {
        // unsubscribe event type channel
        this._one.unsubscribe(eventType);

        // mark channel as unsubscribed
        delete this._subChannels[eventType];
    }

    return result;
};

Happening.prototype.removeAllListeners = function () {
    var emitter     = this._emitter;
    var subChannels = this._subChannels;
    var one         = this._one;

    // unsubscribe all channels
    for (var chan in subChannels) {
        one.unsubscribe(chan);
    }
    this._subChannels = {};

    return emitter.removeAllListeners.apply(emitter, arguments);
};

Happening.prototype.setMaxListeners = function () {
    var emitter = this._emitter;

    // TODO: consider the max listeners in the add/on methods
    return emitter.setMaxListeners.apply(emitter, arguments);
};

Happening.prototype.listeners = function () {
    var emitter = this._emitter;

    return emitter.listeners.apply(emitter, arguments);
};

Happening.prototype.emit = function () {
    return this._one.publish(
        // event type used as channel
        arguments[0],
        // callback arguments sent in the message
        JSON.stringify([Array.prototype.slice.apply(arguments, [1])])
    );
};



// -----------------------------------------------------------------------------

module.exports = {
    create: function (opt, cb) {
        // fix parameter order
        if (typeof opt === 'function') {
            cb = opt;

            opt = {};
        }

        // create new emitter
        var happening = new Happening(opt);

        // start the emitter
        happening.start(function (err) {
            if (err) {
                return cb('Error creating Happening emitter: ' + err);
            }

            cb(null, happening);
        });

        return happening;
    }
};