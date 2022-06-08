'use strict';

import { ClientSubscribeCallback, IClientSubscribeOptions, MqttClient } from 'mqtt';

import type { RequestParameters, Request } from './client';
import { MqttApiOptions, defaultMqttApiOptions, parseJSON } from './helpers';

// listener types
export type ListenerResponse = (data: any) => void;
export type ListenerCallback = (params: RequestParameters, res: ListenerResponse) => void;

export class Server {
    private client: MqttClient;
    private options: MqttApiOptions;
    private listeners: Record<string, ListenerCallback> = {};

    constructor(client: MqttClient, options: Partial<MqttApiOptions> = {}) {
        this.client = client;
        this.options = Object.assign({}, defaultMqttApiOptions, options);

        this.client.on('message', (topic: string, payloadAsBuffer: Buffer) => {
            const payload = payloadAsBuffer.toString()

           if (this.listeners[topic]) {
                const request: Request = parseJSON(payload);
                if (!request) {
                    this.options.logger.warn('got non-JSON request', payload);
                    return;
                }
                if (!request.params || typeof request.params !== 'object' || !request.responseTopic || typeof request.responseTopic !== 'string') {
                    this.options.logger.warn('got invalid request', request);
                    return;
                }
                this.listeners[topic](request.params, (data: any) => this.client.publish(request.responseTopic, JSON.stringify(data)));
            }
        });
    }

    listen(topic: string, listenerCallback: ListenerCallback, clientCallback?: ClientSubscribeCallback): void;
    listen(topic: string, listenerCallback: ListenerCallback, clientOpts: IClientSubscribeOptions, clientCallback?: ClientSubscribeCallback): void;
    listen(topic: string, listenerCallback: ListenerCallback, ...args: any[]): void {
        this.listeners[topic] = listenerCallback;
        this.client.subscribe(topic, ...args);
    }
}
