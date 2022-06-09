import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

import * as mqttApi from '../index';

describe('Request<>Response', () => {
  const mqttClient: Record<string, MqttClient> = {};
  let mqttApiClient: mqttApi.Client;
  let mqttApiServer: mqttApi.Server;

  beforeAll(() => {
    const allPromises = ['Client', 'Server'].map((type: string) => new Promise<void>((resolve) => {
      mqttClient[type] = mqtt.connect({
        host: '127.0.0.1',
        port: 1883,
        clientId: 'tester_' + type,
        keepalive: 10,
      });
      mqttClient[type].on('connect', () => {
        if (type === 'Client') {
          mqttApiClient = new mqttApi.Client(mqttClient[type]);
        } else {
          mqttApiServer = new mqttApi.Server(mqttClient[type]);
        }
        resolve();
      });
    }));
    return Promise.all(allPromises);
  });

  afterAll(() => {
    Object.keys(mqttClient).forEach(key => mqttClient[key].end());
  });

  it('get correct response to request', () => {
    mqttApiServer
      .listen('/test', (params: mqttApi.RequestParameters) => {
        return Promise.resolve({
          testingRequestedParams: params,
        });
      });

    const testParams = {
      test1: "A",
      test2: "B",
    };
    return mqttApiClient
      .request('/test', testParams, {
        timeout: 2000,
      })
      .then((res: any) => {
        expect(res).toStrictEqual({
          testingRequestedParams: testParams,
        });
      });
  });
});
