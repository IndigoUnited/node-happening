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

## Considerations

Here's a list of things you should keep in mind while using `happening`.

1. If you add `once()` listeners on two separate nodes of the emitter, both will run once. Remember that in practice, you ran `once()` twice.
2. `happening` takes a few milliseconds to get up an running, which is why you have a factory method, `create()`, which will only call back once emitter has connected to at least one other node.
3. If you have multiple nodes, it can take a few more milliseconds for an emitter that has just joined 