// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { HttpTriggerOptions } from '@azure/functions';

/**
 * Parameter decorator to add an http trigger to your function that will be triggered by making a request to the function url
 * @param options Optional argument for configuration options describing the route, methods, auth level for the HTTP request
 */
export function http(options?: HttpTriggerOptions): ParameterDecorator;

/**
 * Parameter decorator to add an http trigger to your function that will be triggered by making a 'GET' request to the function url
 * @param options Optional argument for configuration options describing the route, methods, auth level for the HTTP request
 */
export function httpGet(options: HttpTriggerOptions): ParameterDecorator;

/**
 * Parameter decorator to add an http trigger to your function that will be triggered by making a 'POST' request to the function url
 * @param options Optional argument for configuration options describing the route, methods, auth level for the HTTP request
 */
export function httpPost(options: HttpTriggerOptions): ParameterDecorator;
