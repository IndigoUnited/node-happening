'use strict';

var One          = require('1');
var EventEmitter = require('events').EventEmitter;
var uuid         = require('node-uuid');

function inspect(obj, depth, multiLine) {
    var res = require('util').inspect(obj, false, depth || 10, true);

    if (!multiLine) {
        res = res.replace(/(\r\n|\n|\r)/gm, ' ');
    }

    return res.replace(/\s+/g, ' ');
}

var Happening = function (opt) {
    opt = opt || {};

    // the namespace allows the user to separate emitters on the same network,
    // effectively namespacing them
    this._namespace = opt.namespace ? opt.namespace : 'default';

    // this threshold specifies how many nodes the emitter will need to find
    // before it invokes the callback that informs the user that the emitter
    // is ready
    this._readyThreshold = opt.readyThreshold || 1;

    // setup cluster
    var oneOpt = {
        cluster: this._namespace,
        service: 'happening'
    };
    this._one         = new One(oneOpt);
    // obj below holds a list with all the channels that are subscribed
    this._subChannels = {};

// TODO: remove the debug below
// var one = this._one;
// one.on('join', function (cluster) {
//     console.log('joined cluster:', cluster);
// });

// one.on('leave', function (cluster) {
//     console.log('left cluster:', cluster);
// });

// one.on('advertise_start', function (adInfo) {
//     console.log('started advertising:', inspect(adInfo));
// });

// one.on('advertise_stop', function (adInfo) {
//     console.log('stopped advertising:', inspect(adInfo));
// });

// one.on('subscribe', function (channel) {
//     console.log('subscribed:', channel);
// });

// one.on('unsubscribe', function (channel) {
//     console.log('unsubscribed:', channel);
// });

// one.on('node_up', function (node) {
//     console.log('node up:', inspect(node));
// });

// one.on('node_down', function (node) {
//     console.log('node down:', inspect(node));
// });

// one.on('message', function (chan, payload) {
//     console.log('msg:', chan + ':', payload);
// });

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
                var emitter = that._emitter;
                // chan is the event type, and the msg is the callback params
                var args = JSON.parse(msg);
                args.unshift(chan);
                emitter.emit.apply(emitter, args);
            });

            // wait for at least 1 node to join the cluster until the emitter is
            // considered ready
            one.on('node_up', function () {
                // check how many nodes have been found in the cluster
                var id, count = 0;
                for (id in one.getClusterTopology()) {
                    count++;
                }

                // if there are enough nodes
                if (count >= that._readyThreshold) {
                    // mark emitter as running
                    that._running = true;

                    // event emitter ready!
                    cb();
                }
            });
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

Happening.prototype.addListener = Happening.prototype.on = function (event, listener) {
    this._one.subscribe(event);
    this._subChannels[event] = null; // mark channel as subscribed

    return this._emitter.on(event, listener);
};

Happening.prototype.once = function (event, listener) {
    var emitter   = this._emitter;
    var one       = this._one;
    
    var tmp = function () {
        // if this is the last listener for this event type
        if (emitter.listeners(event).length === 0) {
            // unsubscribe channel
            one.unsubscribe(event);
        }

        // callback
        listener.apply(listener, arguments);
    };


    emitter.once(event, tmp);
};

Happening.prototype.removeListener = function (event, listener) {
    var emitter = this._emitter;

    var result  = emitter.removeListener(event, listener);

    // if there are no more listeners for the event type
    if (!emitter.listeners().length) {
        // unsubscribe event type channel
        this._one.unsubscribe(event);

        // mark channel as unsubscribed
        delete this._subChannels[event];
    }

    return result;
};

Happening.prototype.removeAllListeners = function (event) {
    var subChannels = this._subChannels;
    var one         = this._one;

    // unsubscribe all channels
    for (var chan in subChannels) {
        one.unsubscribe(chan);
    }
    this._subChannels = {};

    return this._emitter.removeAllListeners(event);
};

Happening.prototype.setMaxListeners = function (n) {
    return this._emitter.setMaxListeners(n);
};

Happening.prototype.listeners = function (event) {
    return this._emitter.listeners(event);
};

Happening.prototype.emit = function (event) {
    return this._one.publish(
        // event type used as channel
        event,
        // callback arguments sent in the message
        JSON.stringify(Array.prototype.slice.apply(arguments, [1]))
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