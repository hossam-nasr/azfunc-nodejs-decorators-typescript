// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import {
    FunctionHandler as AzFuncFunctionHandler,
    FunctionInput,
    FunctionOutput,
    FunctionResult,
    FunctionTrigger,
    InvocationContext,
} from '@azure/functions';

export * from './cosmosdb';
export * from './http';
export * from './storage';

export interface FunctionInfo {
    trigger?: Trigger;

    return?: FunctionOutput;

    extraInputs?: Input[];

    extraOutputs?: Output[];
}

export interface Input extends FunctionInput {
    index: number;
}

export interface Output extends FunctionOutput {
    index: number;
}

export interface Trigger extends FunctionTrigger {
    index: number;
}

export interface TimerOptions {
    /**
     * If `true`, the function is invoked when the runtime starts.
     * For example, the runtime starts when the function app wakes up after going idle due to inactivity, when the function app restarts due to function changes, and when the function app scales out.
     * _Use with caution_. runOnStartup should rarely if ever be set to `true`, especially in production.
     */
    runOnStartup?: boolean;

    /**
     * When true, schedule will be persisted to aid in maintaining the correct schedule even through restarts. Defaults to true for schedules with interval >= 1 minute
     */
    useMonitor?: boolean;
}

export type FunctionHandler = AzFuncFunctionHandler &
    ((context: InvocationContext, trigger: any, ...args: any) => FunctionResult);

/**
 * Parameter decorator to add a timer trigger to your function that will be triggered on a schedule
 * @param schedule A [cron expression](https://docs.microsoft.com/azure/azure-functions/functions-bindings-timer?pivots=programming-language-javascript#ncrontab-expressions) of the format '{second} {minute} {hour} {day} {month} {day of week}' to specify the schedule
 * @param options Optional argument for extra configuration options
 */
export function timer(schedule: string, options?: TimerOptions): ParameterDecorator;

/**
 * Method decorator to register your function to the function App
 * @param name optional parameter to specify the function name. If not specified, the method name is used
 */
export function azureFunction(name?: string): MethodDecorator;

/**
 * Method decorator to set the optional primary output of the function
 * This is the main output that you should set as the return value of the function handler during invocation
 * @param options configuration options for the primary ouput
 */
export function returns(options: FunctionOutput): MethodDecorator;

/**
 * Parameter decorator to set a generic trigger for your funciton
 * @param type the type of the trigger
 * @param options the options to configure the trigger
 */
export function trigger(type: string, options?: Record<string, unknown>): ParameterDecorator;

/**
 * Parameter decorator to set a generic extra input for your function
 * @param type the type of input
 * @param options configuration options for the input
 */
export function input(type: string, options?: Record<string, unknown>): ParameterDecorator;

/**
 * Parameter decorator to set a generic extra output for your function
 * @param type the type of input
 * @param options configuration options for the output
 */
export function output(type: string, options?: Record<string, unknown>): ParameterDecorator;
