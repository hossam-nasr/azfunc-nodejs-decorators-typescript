// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import { CosmosDBTriggerOptions } from '@azure/functions';

/**
 * Parameter decorator to add an cosmosDB trigger to your function will be triggered whenever inserts and updates occur (not deletions)
 * @param settings Configuration options describing the connections for CosmosDB
 */
export function cosmosDBTrigger(settings: CosmosDBTriggerOptions): ParameterDecorator;
