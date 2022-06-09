// import mqtt.js as our MQTT client
import * as mqtt from 'mqtt';

// import mqtt-api
import * as mqttApi from '../../src';

// connect MQTT client
const mqttClient: mqtt.MqttClient = mqtt.connect({
  host: '127.0.0.1',
  port: 1883,
  clientId: 'mqtt-api-example-server',
  keepalive: 10,
});

// wait for successfull connection of MQTT client
mqttClient.on('connect', () => {
  // initialize mqtt-api server
  const mqttApiServer: mqttApi.Server = new mqttApi.Server(mqttClient);

  // set up listener (async/await style)
  mqttApiServer.listen('/test-async', async (params: mqttApi.RequestParameters) => {
    console.log('recieved request on /test-async', params);
    return {
      processed: 'OK',
      requestedParams: params,
    };
  });

  // set up listener (Promise-style)
  mqttApiServer.listen('/test-promise', (params: mqttApi.RequestParameters) => {
    console.log('recieved request on /test-promise', params);
    return Promise.resolve({
      processed: 'OK',
      requestedParams: params,
    });
  });

  console.log('> mqtt-api server is up & running');
});