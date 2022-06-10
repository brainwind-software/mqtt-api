import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

import * as mqttApi from '../index';

describe('Timeout', () => {
  let mqttClient: MqttClient;
  let mqttApiClient: mqttApi.Client;

  beforeAll(() => {
    return new Promise<void>((resolve) => {
      mqttClient = mqtt.connect({
        host: '127.0.0.1',
        port: 1883,
        clientId: 'tester',
        keepalive: 10,
      });
      mqttClient.on('connect', () => {
        mqttApiClient = new mqttApi.Client(mqttClient);
        resolve();
      });
    });
  });

  afterAll(() => {
    mqttClient.end();
  });

  it('Times out, if no listener responds', () => {
    const testParams = {
      test1: 'A',
      test2: 'B',
    };
    return mqttApiClient
      .request('/test', testParams, {
        timeout: 2000,
      })
      .then(() => {})
      .catch((err: mqttApi.ResponseError) => {
        expect(err).toStrictEqual({
          text: 'Request timed out',
          type: 'timeout',
        });
      });
  });
});
