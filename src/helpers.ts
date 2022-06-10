'use strict';

// options
export type MqttApiOptions = {
  logger: typeof console;
  response: {
    topicPrefix: string;
    defaultTimeout: number;
  };
};

export type JSONobject = string | number | boolean | { [x: string]: JSONobject } | JSONobject[];

export const defaultMqttApiOptions: MqttApiOptions = {
  logger: console,
  response: {
    topicPrefix: '/res/',
    defaultTimeout: 10000,
  },
};

// helper functions
export function parseJSON(val: string) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return false;
  }
}
