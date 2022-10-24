// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { app, FunctionOutput, InvocationContext } from '@azure/functions';
import { FunctionHandler, FunctionInfo, Input, Output, Trigger } from 'azure-functions-decorators-typescript';

export default class FunctionApp {
    private static functions: Map<string, FunctionInfo> = new Map<string, FunctionInfo>();

    static addTrigger(functionName: string, trigger: Trigger) {
        if (!FunctionApp.functions[functionName]) {
            FunctionApp.functions[functionName] = {
                trigger,
            };
            return;
        }
        const functionInfo: FunctionInfo = FunctionApp.functions[functionName] as FunctionInfo;
        if (functionInfo.trigger) {
            throw new Error(
                `A trigger was already defined for the function ${functionName}. A function must have only one trigger.`
            );
        }
        functionInfo.trigger = trigger;
    }

    static registerFunction(functionId: string, functionHandler: FunctionHandler, overridingFunctionName?: string) {
        const functionName = overridingFunctionName || functionId;

        const functionInfo: FunctionInfo = FunctionApp.functions[functionId] as FunctionInfo;
        if (!functionInfo || !functionInfo.trigger) {
            throw new Error(`Error registering function ${functionName}: no trigger is defined for this function`);
        }

        if (typeof functionInfo.trigger?.index === 'undefined') {
            throw new Error(
                `There was a problem in configuring the trigger for function ${functionName}. Please check your trigger definition.`
            );
        }

        const newHandler = async (context: InvocationContext, trigger: unknown): Promise<any> => {
            if (typeof functionInfo.trigger?.index === 'undefined') {
                throw new Error(
                    `There was a problem in accessing the trigger for function ${functionName}. Please check your trigger definitions.`
                );
            }
            const resolvedBindings = [
                { index: 0, value: context },
                { index: functionInfo.trigger.index, value: trigger },
            ];
            if (functionInfo.extraInputs) {
                functionInfo.extraInputs.map((input) => {
                    const inputValue = context.extraInputs.get(input);
                    resolvedBindings.push({ index: input.index, value: inputValue });
                });
            }
            if (functionInfo.extraOutputs) {
                functionInfo.extraOutputs.map((output) => {
                    const outputValue = {
                        set(value: any) {
                            context.extraOutputs.set(output, value);
                        },
                    };
                    resolvedBindings.push({ index: output.index, value: outputValue });
                });
            }

            resolvedBindings.sort((a, b) => a.index - b.index);
            const args = resolvedBindings.map(({ value }) => value);
            // @ts-ignore spread arguments
            return (await functionHandler(...args)) as unknown;
        };

        app.generic(functionName, {
            handler: newHandler,
            trigger: functionInfo.trigger,
            ...functionInfo,
        });
    }

    static setReturnValue(functionName: string, returnOptions: FunctionOutput) {
        const functionInfo: FunctionInfo = FunctionApp.functions[functionName] as FunctionInfo;
        if (functionInfo) {
            functionInfo.return = returnOptions;
            return;
        }
        FunctionApp.functions[functionName] = {
            return: returnOptions,
        };
    }

    static hasReturnValue(functionName: string) {
        const functionInfo: FunctionInfo = FunctionApp.functions[functionName] as FunctionInfo;
        return typeof functionInfo.return !== 'undefined';
    }

    static addInput(functionName: string, inputOptions: Input) {
        const functionInfo: FunctionInfo = FunctionApp.functions[functionName] as FunctionInfo;
        if (functionInfo) {
            if (functionInfo.extraInputs) {
                functionInfo.extraInputs.push(inputOptions);
                return;
            }
            functionInfo.extraInputs = [inputOptions];
            return;
        }
        FunctionApp.functions[functionName] = {
            extraInputs: [inputOptions],
        };
    }

    static addOutput(functionName: string, outputOptions: Output) {
        const functionInfo: FunctionInfo = FunctionApp.functions[functionName] as FunctionInfo;
        if (functionInfo) {
            if (functionInfo.extraOutputs) {
                functionInfo.extraOutputs.push(outputOptions);
                return;
            }
            functionInfo.extraOutputs = [outputOptions];
            return;
        }
        FunctionApp.functions[functionName] = {
            extraOutputs: [outputOptions],
        };
    }
}
