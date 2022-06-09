// import mqtt.js as our MQTT client
const mqtt = require('mqtt');

// import mqtt-api
const mqttApi = require('../../lib');

// connect MQTT client
const mqttClient = mqtt.connect({
  host: '127.0.0.1',
  port: 1883,
  clientId: 'mqtt-api-example-client',
  keepalive: 10,
});

// wait for successfull connection of MQTT client
mqttClient.on('connect', async () => {
  // initialize mqtt-api client
  const mqttApiClient = new mqttApi.Client(mqttClient);

  // set request parameters & options
  const params = {
    foo: "bar",
    test: "something",
  };
  const options = {
    timeout: 2000,
  };

  // request (async/await style)
  console.log('>>> requesting (async/await style) on /test-async: ', params);
  try {
    const response = await mqttApiClient.request('/test-async', params, options);
    console.log('response is: ', response);
  } catch (err) {
    console.error('request error: ', err);
  }

  // request (Promise-style)
  console.log('>>> requesting (Promise-style) on /test-promise: ', params);
  mqttApiClient.request('/test-promise', params, options)
    .then((response) => {
      console.log('response is: ', response);
    })
    .catch((err) => {
      console.error('request error: ', err);
    })
    .finally(() => process.exit());
});
