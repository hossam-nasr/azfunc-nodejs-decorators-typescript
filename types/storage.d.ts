// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

/**
 * Parameter decorator to add a blob trigger to your function that will be triggered when an item is added to a storage blob path
 * @param path The path to the blob container, for example "samples-workitems/{name}"
 * @param connection An app setting (or environment variable) wit the storage connection string to be used by this blob trigger
 */
export function blobTrigger(path: string, connection: string): ParameterDecorator;

/**
 * Parameter decorator to add a blob output to your function that will be allow you to write a blob to a storage blob path
 * @param path The path to the blob container, for example "samples-workitems/{name}"
 * @param connection An app setting (or environment variable) wit the storage connection string to be used by this blob output
 */
export function blobOutput(path: string, connection: string): ParameterDecorator;

/**
 * Parameter decorator to add a blob input to your function that will be allow you to read a blob from a storage blob path
 * @param path The path to the blob container, for example "samples-workitems/{name}"
 * @param connection An app setting (or environment variable) wit the storage connection string to be used by this blob input
 */
export function blobInput(path: string, connection: string): ParameterDecorator;

/**
 * Parameter decorator to add a storage queue trigger to your function that will be triggered when an item is added to a storage queue
 * @param queueName The queue name
 * @param connection An app setting (or environment variable) wit the storage connection string to be used by this storage queue trigger
 */
export function queueTrigger(queueName: string, connection: string): ParameterDecorator;

/**
 * Parameter decorator to add a storage queue output to your function that allows you to write a storage queue
 * @param queueName The queue name
 * @param connection An app setting (or environment variable) wit the storage connection string to be used by this storage queue trigger
 */
export function queueOutput(queueName: string, connection: string): ParameterDecorator;
