# Azure Functions TypeScript Decorators

|Branch|Support level|Node.js Versions|
|---|---|---|
|main|Preview|18 (preview)|

## Install

```
npm install azure-functions-decorators-typescript
```

## Usage

This library contains definitions for TypeScript decorators that makes registering and defining Azure Functions easier than ever! Building upon the [new Node.js programming model](https://github.com/Azure/azure-functions-nodejs-library/wiki/Azure-Functions-Node.js-Framework-v4) (v4 of `@azure/functions`), this library extends that framework to allow users to register functions using decorators!

This library is just a personal hackathon project, so there is no clear plan on when or if this may become officially public. That being said, you can try out the limited functionality that exists now and give your feedback for improvements!

### Prerequisites

- Node.js v18+
- TypeScript v4+

### Setup
For a ready-to-run app, clone this repo: https://github.com/hossam-nasr/func-node-decorators-prototype and fpllow the instructions in the README.

If you are creating your own app, the instructions you need to follow to run an app with v4 of `@azure/functions` still apply to this library. See more detailed information here: https://github.com/Azure/azure-functions-nodejs-library/wiki/Azure-Functions-Node.js-Framework-v4. Namely, take note of these important points:

1. Make sure you reference this preview npm package in your package.json: `"func-cli-nodejs-v4": "4.0.4764"`. This is a preview build of the func CLI that contains tooling support for running the new framework, which this library relies on.
2. If you are using an extension bundle, you must be on version 3.15.0 or greater, e.g. by specifying `[3.15.0, 4.0.0]` in your `host.json` file.
3. You must set the `AzureWebJobsStorage` setting to a valid value in your `local.settings.json` file, either to a connection string of a valid Azure storagea account, or to `UseDevelopmentStorage=true` and use the [local storage emulator](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio).

### Define your functions using decorators!

You can now define your functions using TypeScript decorators! Below are a few examples:

#### Simple HTTP trigger function: 

<table>
<tr>
<th> Default </th>
<th> Decorators! </th>
</tr>
<tr />
<tr>
<td>

`src/HttpTrigger1/index.ts`:

```JS
module.exports = async function(context, req) {
    context.log("HTTP function processed request");

    const name = req.query.name 
        || req.body 
        || 'world';

    context.res - {
        body: `Hello, ${name}!`
    };
};
```

`src/HttpTrigger1/function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

</td>
<td>

`src/index.ts`:

```TS
import { 
    azureFunction, 
    http 
} from 'azure-functions-decorators-typescript'

class FunctionApp {
    @azureFunction()
    async httpTrigger1(context, @http() request) {
        context.log("Http function processed request");

        const name = request.query.get('name') 
            || (await request.text()) 
            || 'world';

        return {
            body: `Hello, ${name}`,
        };
    }
}

export default FunctionApp
```
</td>
</ tr>
</table>

#### Setting an extra blob input:

<table>
<tr>
<th> Default </th>
<th> Decorators! </th>
</tr>
<tr />
<tr>
<td>

`src/MyFunction/index.ts`:

```JS
module.exports = async function(context, req) {
    context.log("HTTP function processed request");

    const name = context.bindings.blobInput;

    context.res = {
        body: `Hello, ${name}!`
    };
};
```

`src/HttpTrigger1/function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "blob",
      "name": "blobInput",
      "direction": "in",
      "path": "helloworld/{name}"
      "connection": "storage_conn"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

</td>
<td>

`src/index.ts`:

```TS
import { 
    azureFunction, 
    http,
    blobInput
} from 'azure-functions-decorators-typescript'

class FunctionApp {
    @azureFunction()
    async httpTrigger1(
        context, 
        @http() request, 
        @blobInput('helloworld/{name}', 'storage_conn') blobInput
    ) {
        context.log("Http function processed request");

        const name = blobInput;

        return {
            body: `Hello, ${name}`,
        };
    }
}

export default FunctionApp
```
</td>
</ tr>
</table>

#### Setting an extra queue output:

<table>
<tr>
<th> Default </th>
<th> Decorators! </th>
</tr>
<tr />
<tr>
<td>

`src/MyFunction/index.ts`:

```JS
module.exports = async function(context, req) {
    context.log("HTTP function processed request");

    const name = req.query.name 
        || req.body 
        || 'world';
        
    context.bindings.queueOut = name;

    context.res = {
        body: `Hello, ${name}!`
    };
};
```

`src/HttpTrigger1/function.json`:

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "queue",
      "name": "queueOut",
      "direction": "output",
      "queueName": "helloworld"
      "connection": "storage_conn"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

</td>
<td>

`src/index.ts`:

```TS
import { 
    azureFunction, 
    http,
    queueOutput
} from 'azure-functions-decorators-typescript'

class FunctionApp {
    @azureFunction()
    async httpTrigger1(
        context, 
        @http() request, 
        @queueOutput('helloworld', 'storage_conn') queueOut
    ) {
        context.log("Http function processed request");

        const name = request.query.get('name') 
            || (await request.text()) 
            || 'world';
        
        queueOut.set(name);

        return {
            body: `Hello, ${name}`,
        };
    }
}

export default FunctionApp
```
</td>
</ tr>
</table>

### Supported triggers and bindings

As this is just a hackathon project at the moment, most triggers and bindings do not have their own custom decorators. Below is a list of the available triggers and bindings and their supported state. This list will be updated when/if more triggers and bindings are added. The list of all available triggers and bindings was retrieved from the Microsoft docs [here](https://learn.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=javascript#supported-bindings)

|Type|Trigger|Input|Output|
|---|---|---|---|
HTTP | ✅ | | ❌ 
Timer | ✅ | | |
Storage blob | ✅ | ✅ | ✅
Storage queue | ✅ | | ✅
CosmosDB | ✅ | ❌ | ❌
Azure SQL |  | ❌ | ❌
Dapr | ❌ | ❌ | ❌
Event Grid | ❌ |  | ❌
Event Hubs | ❌ |  | ❌
IoT Hub | ❌ |  | 
Kafka | ❌ |  | ❌
Mobile Apps |  | ❌ | ❌
Notification Hubs |  |  | ❌
RabbitMQ | ❌ |  | ❌
SendGrid |  |  | ❌
Service Bus | ❌ |  | ❌
SignalR | ❌ | ❌ | ❌
Table storage |  | ❌ | ❌
Twilio |  |  | ❌

### Generic triggers, inputs, and outputs


