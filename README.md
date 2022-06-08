# MQTT-API
MQTT-API is a client & server library for API-like usage of the [MQTT](http://mqtt.org/) protocol following the request-response paradigm.
Written in TypeScript/JavaScript for node.js and the browser.
Only depends on [MQTT.js](https://github.com/mqttjs/MQTT.js).

## Table of Contents
* [Introduction](#intro)
* [Installation](#install)
* [Examples](#examples)
* [License](#license)

<a name="intro"></a>
## Introduction
**Did you ever want to follow the request-response paradigm on MQTT?**

Imagine you have a service publishing some MQTT message (*request*) and awaiting some kind of answer to that (*response*), at least some ack/nack. So your service would have to subscribe to the response-topic before publishing the request.

For Example:
You publish your request on topic */command/action*,
and you subscribe to the response topic */command/result*

However with usual MQTT you never know if the response is linked to your initial request or to some request, published by another service or another frontend user, ...
On top of that, your service may be waiting forever for an answer, because you miss some timeout feature like any usual request-response method (e.g. HTTP GET/PUT/...)

**Now MQTT-API is here to help you out!**

It follows the usual request-response paradigm, introducing clients and servers (Don't panic - you can mix them in one file ;) ). This means:
- clients can be sure the received response is linked to their request
- clients can configure a timeout, after which the request gets aborted
- clients do not need to subscribe to some response topic
- servers do not have to handle publishing the response to the correct topic

<a name="install"></a>
## Installation

```sh
npm install mqtt-api --save
```

<a name="example"></a>
## Examples

*Coming soon...*

<a name="license"></a>
## License

MIT
