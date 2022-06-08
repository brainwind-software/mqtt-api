'use strict';

import { IClientPublishOptions, MqttClient, PacketCallback } from 'mqtt';

import { MqttApiOptions, defaultMqttApiOptions, parseJSON } from './helpers';

// request types
export type RequestParameters =
    | string
    | number
    | boolean
    | { [x: string]: RequestParameters }
    | RequestParameters[];
export type RequestOptions = {
    timeout?: number;
};
export type Request = {
    responseTopic: string;
    params: RequestParameters;
};

// response error types
export enum ResponseErrorType {
    Timeout = 'timeout',
};
export type ResponseError = {
    type: ResponseErrorType;
    text: string;
};

export class Client {
    private client: MqttClient;
    private options: MqttApiOptions;
    private requests: Record<string, {
        abortTimeout?: ReturnType<typeof setTimeout>;
        resolve: (data: any) => void;
    }> = {};

    constructor(client: MqttClient, options: Partial<MqttApiOptions> = {}) {
        this.client = client;
        this.options = Object.assign({}, defaultMqttApiOptions, options);

        this.client.on('message', (topic: string, payloadAsBuffer: Buffer) => {
            const payload = payloadAsBuffer.toString()

            if (this.requests[topic]) {
                const response = parseJSON(payload);
                if (!response) {
                    this.options.logger.warn('got non-JSON response', payload);
                    return;
                }

                if (this.requests[topic].abortTimeout) {
                    clearTimeout(this.requests[topic].abortTimeout);
                }
                this.requests[topic].resolve(response);

                delete this.requests[topic];
            }
        });
        this.client.subscribe(`${this.options.response.topicPrefix}#`);
    }

    private generateUniqueID(): string {
        return (Date.now().toString(36) + Math.random().toString(36)).replace(/\./g, '');
    }

    request(topic: string, params: RequestParameters, options?: RequestOptions, clientCallback?: PacketCallback): Promise<Response>;
    request(topic: string, params: RequestParameters, options: RequestOptions, clientOpts: IClientPublishOptions, clientCallback?: PacketCallback): Promise<Response>;
    request(topic: string, params: RequestParameters, options?: RequestOptions, ...args: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const responseTopic = `${this.options.response.topicPrefix}${this.generateUniqueID()}`;

            let abortTimeout;
            const timeoutMs = options?.timeout !== undefined
                ? options.timeout
                : this.options.response.defaultTimeout;
            if (timeoutMs > 0) {
                abortTimeout = setTimeout(() => {
                    delete this.requests[responseTopic];
                    const error: ResponseError = {
                        type: ResponseErrorType.Timeout,
                        text: 'Request timed out',
                    };
                    reject(error);
                }, timeoutMs);
            }

            this.requests[responseTopic] = {
                abortTimeout,
                resolve,
            };

            const request: Request = {
                responseTopic,
                params,
            };
            this.client.publish(topic, JSON.stringify(request), ...args);
        });
    }
}
