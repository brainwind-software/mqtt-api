// import mqtt.js as our MQTT client
const mqtt = require('mqtt');

// import mqtt-api
const mqttApi = require('../../lib');

// connect MQTT client
const mqttClient = mqtt.connect({
  host: '127.0.0.1',
  port: 1883,
  clientId: 'mqtt-api-example-server',
  keepalive: 10,
});

// wait for successfull connection of MQTT client
mqttClient.on('connect', () => {
  // initialize mqtt-api server
  const mqttApiServer = new mqttApi.Server(mqttClient);

  // set up listener (async/await style)
  mqttApiServer.listen('/test-async', async (params) => {
    console.log('recieved request on /test-async', params);
    return {
      processed: 'OK',
      requestedParams: params,
    };
  });

  // set up listener (Promise-style)
  mqttApiServer.listen('/test-promise', (params) => {
    console.log('recieved request on /test-promise', params);
    return Promise.resolve({
      processed: 'OK',
      requestedParams: params,
    });
  });

  console.log('> mqtt-api server is up & running');
});