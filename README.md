happening
=========

`Distributed network-based event emitter for NodeJS`

----------------------------------------------------

## Installing

Installing `happening` is as simple as running `npm install happening`.

Note that `happening` depends on [One](http://github.com/IndigoUnited/node-1), a distributed message queue based on [ØMQ](http://zeromq.com). So, if you're having a hard time installing, refer to its [installation instructions](https://github.com/IndigoUnited/node-1#installing).

## Usage

You can use `happening` just like you would with any other event emitter. Here's a quick example:

```js
var Happening = require('happening');

happening = Happening.create(function (err) {
    if (err) {
        throw err;
    }
    
    happening.on('my_event', function (param1, param2) {
        console.log('got called with', param1, 'and', param2);
    });
    
    setInterval(function () {
        happening.emit('my_event', 'this', 'that');
    }, 500);
});
```