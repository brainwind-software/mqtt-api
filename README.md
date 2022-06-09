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
**Note**: These short examples are written in TypeScript, but you can also use MQTT-API with pure JavaScript, just remove the types from the code.
(Have a look at the examples directory in this repository)

**Prerequisite**

You need a running MQTT server instance, if you just want to make some tests, you might use the dockerized version of mosquitto:
```sh
docker run -it -p 1883:1883 eclipse-mosquitto mosquitto -c /mosquitto-no-auth.conf
```

**Client (Promise-style)**
```node
// set request parameters & options
const params = {
  foo: "bar",
  test: "something",
};
const options: mqttApi.RequestOptions = {
  timeout: 2000,
};

// request (Promise-style)
mqttApiClient.request('/test', params, options)
  .then((response: mqttApi.ResponseParameters) => {
    console.log('response is: ', response);
  })
  .catch((err: mqttApi.ResponseError) => {
    console.error('request error: ', err);
  });
```

**Client (async/await style)**
```node
// set request parameters & options
const params = {
  foo: "bar",
  test: "something",
};
const options: mqttApi.RequestOptions = {
  timeout: 2000,
};

// request (async/await style)
console.log('>>> requesting (async/await style) on /test: ', params);
try {
  const response: mqttApi.ResponseParameters = await mqttApiClient.request('/test', params, options);
  console.log('response is: ', response);
} catch (err) {
  console.error('request error: ', err);
}
```

**Server (Promise-style)**
```node
// set up listener (Promise-style)
mqttApiServer.listen('/test', (params: mqttApi.RequestParameters) => {
  return Promise.resolve({
    processed: 'OK',
    requestedParams: params,
  });
});
```

**Server (async/await style)**
```node
// set up listener (async/await style)
mqttApiServer.listen('/test-async', async (params: mqttApi.RequestParameters) => {
  return {
    processed: 'OK',
    requestedParams: params,
  };
});
```

**Full, working examples**

For full, working examples see examples directory in this repository.


<a name="license"></a>
## License

MIT
