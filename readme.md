## CoquitoJS

CoquitoJS is backend web framework built on top of ExpressJS meant to help make scaffolding a variety of backend frameworks much easier.

With a few simple configurations and scaffolds you can have RPC, REST and GraphQL APIs running in minutes.

## Basic Use

The simplest use is using Coquito to handle a lot of the boilerplate when writing express apps. Just pass what you need to the CoquitoApp constructor.

```js
import CoquitoApp from "coquito";
import cors from "cors";
import morgan from "morgan";

// create application, define routers,middleware, port, host
const app = new CoquitoApp({
  port: 4000,
  bodyparsers: true,
  host: "localhost",
  routers: ["/sample", "/example"],
  middleware: [cors(), morgan("dev")],
});

// sample route for sample router
app.sample.get("/", (req, res) => {
  res.send("I see the samples");
});

// sample route for example router
app.example.get("/", (req, res) => {
  res.send("I see the examples");
});

// turn on listener
app.listen();
```

In constructor we see the following properties defined in the config object (the argument to CoquitoApp):

- port: define the port to be used, will prioritize process.env.PORT if exists. Defaults to 3333.

- host: defines the host, will prioritize process.env.HOST if exists. Defaults to localhost.
- routers: an array of endpoints to generate routers for, an express router will be available for each one at `CoquitoApp.endpoint`. (Refer to above example)

- middleware: An array of middleware functions to be registered with application. These will be registered in the order they are in the array and registered before all routers. Keep in mind express.json and express.urlencoded are registered by default if `config.bodyparsers` is set to true.

### If you are wondering

**Can I access the core express app**
yes, it is the `app` property of the instance at `CoquitoApp.app` so referring to the example above if I wanted to define the root root route I'd do so like this:

```js
app.app.get("/", (req, res) => {...})
```

**What if I want to register an array of middleware or routers with a router like we did globally**

A `CoquitoApp` Instance has a few methods built in we could use with our scaffolded routers.

Let's say I want to register the following middleware only on the `sample` router defined in the basic example I could:

```js
app.registerMiddleware([morgan("dev"), cors()], this.sample);
```

First argument is the array of middleware and second argument the router you are registering it to.

You can also register subrouters similarly.

```js
app.routers([
    "/cheese",
    "/bread"
], app.sample, app.sample)

// "/sample/cheese"
app.sample.cheese.get(...)

// "/sample/bread"
app.sample.bread.get(...)
```

First argument being endpoints you want to routers for, and the second two arguments defining the target router these are subrouters for. (you need both arguments as they have different defaults when registering top level routers)

**What if I need a static server**
Add `static` property to the config object that contains a string with the name of the folder in your project root that should act as your static folder.

```js
const app = new CoquitoApp({
  static: "public"
})
```

**What if I need to configure the application object or define routes before middleware is registered?**

Define a `prehook` property in config with a functions that takes the express app object as an argument and you can do any desired custom express code you want running before Coquito registers middleware and routers.

```js
import liquid from "liquid-express-views"

function prehook(app){
  // configure liquid view engine
  liquid(app)
}

const app = new CoquitoApp({
  prehook
})

```

## Multi File Setup

What if you want to break this up into multiple files, how do we recommend doing it. Use the following file structure.

```js
-/controllers
    -/router1.js
    -/router2.js
- server.js
```

Essentially each controller file should define a function that takes the router and registers any middleware or routes for that router.

/controllers/sample.js

```js
const sampleRoutes = (router) => {
  // "/sample"
  router.get("/", (req, res) => {
    res.send("you visited /sample");
  });
};

export default sampleRoutes;
```

/controllers/example.js

```js
const exampleRoutes = (router) => {
  // "/example"
  router.get("/", (req, res) => {
    res.send("you visited /example");
  });
};

export default exampleRoutes;
```

server.js

```js
import CoquitoApp from "coquito";
import sampleRoutes from "./controllers/sample.js";
import exampleRoutes from "./controllers/example.js";
import cors from "cors";
import morgan from "morgan";

// create application, define routers,middleware, port, host
const app = new CoquitoApp({
  port: 4000,
  bodyparsers: true,
  host: "localhost",
  routers: ["/sample", "/example"],
  middleware: [cors(), morgan("dev")],
});

sampleRoutes(app.sample);
exampleRoutes(app.example);

app.listen();
```

## Setting up a GraphQL API

You can setup a graphql API pretty easily with the following structure.

```
- rootValue.js
- schema.js
- server.js
```

rootValue.js

```js
const rootValue = {
  // Resolver for getTodos query
  getTodos: () => todos,
  // Resolver for createTodo mutation
  createTodo: (args) => {
    const message = args.message;
    todos.push({ message });
    return "success";
  },
};

export default rootValue;
```

These define all the functions (queries and mutations) that will be invoked as graphQL queries are submitted.

schema.js

```js
export default `
type Todo {
    message: String
}

type Query {
  getTodos: [Todo] 
}

type Mutation {
  createTodo(message: String): String
}
`;
```

This file contains our graphQL schema, you just have to pass the string, Coquito will handle the graphql parsing.

[How to Write GraphQL Schemas](https://graphql.org/learn/schema/)

server.js

```js
import CoquitoApp from "coquito";
import schema from "./schema.js";
import rootValue from "./rootValue.js";

// create application, define routers,middleware, port, host
const app = new CoquitoApp({
  port: 4000,
  middleware: [
    (req, res, next) => {
      console.log(req.method, req.url);
      next();
    },
  ],
  bodyparsers: true,
  host: "localhost",
  graphql: {
    rootValue,
    schema,
  },
});

// start app
app.listen();
```

You can now run your server and make a post request to `/graphql` with a graphql client or by making a post request where the graphql query string is in `req.body.query`.

```json
{
    "query": "query {
        getTodos{
            message
        }
    }"
}
```

### SimpleRPC API

SimpleRPC is an RPC framework I created based on the pattern illustrated by React Redux. You can read more here:

[SimpleRPC-Server](https://www.npmjs.com/package/@alexmerced/simplerpc-server)
[SimpleRPC-Client](https://www.npmjs.com/package/@alexmerced/simplerpc-client)

Coquito can handle much of the server side setup for you then you can load up the client on your frontend and enjoy the SimpleRPC experience.

Now setting up a SimpleRPC API with coquito is simple as this file structure:

```
- actions.js
- context.js
- server.js
```

actions.js
```js
const actions = {
    getList: (payload, context) => {
        console.log(context)
        return [1,2,3,4,5]
    },

    addToList: (payload, context) => {
        console.log(context)
        return [1,2,3,4,5, payload.num]
    }
}

export default actions
```
Here is where we define all our functions that can be called from our client side dispatch calls.

context.js
```js
const context = {}

export default context
```
Context is an object with any additional data you'd want accessible to your actions such as app wide settings or information.

server.js
```js
import CoquitoApp from "coquito";
import actions from "./actions.js";
import context from "./context.js";

// create application, define routers,middleware, port, host
const app = new CoquitoApp({
  port: 4000,
  middleware: [
    (req, res, next) => {
      console.log(req.method, req.url);
      next();
    },
  ],
  bodyparsers: true,
  host: "localhost",
  rpc: {
    actions,
    context
  },
});

// start app
app.listen();
```

Once that is all setup you can make requests either using the simpleRPC client with the "/rpc" endpoint or make post requests to "/rpc" with a body in this shape.

```json
{
    "type": "actionName",
    "payload":{
        "arg1": 1,
        "arg2": "whatever"
    }
}
```

### Mixing and Matching
You can have all these properties defined, so having a GraphQL, RPC and Rest API side by side is all of matter of the properties you pass to Coquito.

## Coming Soon
- Scaffold Methods for Generating Scaffolding Scripts
- CLI for incremental scaffolding