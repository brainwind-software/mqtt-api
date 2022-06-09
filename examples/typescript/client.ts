// import mqtt.js as our MQTT client
import * as mqtt from 'mqtt';

// import mqtt-api
import * as mqttApi from '../../src';

// connect MQTT client
const mqttClient: mqtt.MqttClient = mqtt.connect({
  host: '127.0.0.1',
  port: 1883,
  clientId: 'mqtt-api-example-client',
  keepalive: 10,
});

// wait for successfull connection of MQTT client
mqttClient.on('connect', async () => {
  // initialize mqtt-api client
  const mqttApiClient: mqttApi.Client = new mqttApi.Client(mqttClient);

  // set request parameters & options
  const params = {
    foo: "bar",
    test: "something",
  };
  const options: mqttApi.RequestOptions = {
    timeout: 2000,
  };

  // request (async/await style)
  console.log('>>> requesting (async/await style) on /test-async: ', params);
  try {
    const response: mqttApi.ResponseParameters = await mqttApiClient.request('/test-async', params, options);
    console.log('response is: ', response);
  } catch (err) {
    console.error('request error: ', err);
  }

  // request (Promise-style)
  console.log('>>> requesting (Promise-style) on /test-promise: ', params);
  mqttApiClient.request('/test-promise', params, options)
    .then((response: mqttApi.ResponseParameters) => {
      console.log('response is: ', response);
    })
    .catch((err: mqttApi.ResponseError) => {
      console.error('request error: ', err);
    })
    .finally(() => process.exit());
});
