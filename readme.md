## CoquitoJS

CoquitoJS is backend web framework built on top of ExpressJS meant to help make scaffolding a variety of backend frameworks much easier.

With a few simple configurations and scaffolds you can have RPC, REST and GraphQL APIs running in minutes.

## QuickStart

The best way to start a new project is the CLI documented in the next section, but this section shows you a quick way to generate a standard template without the CLI.

While you should still read the documentation below to understand how a lot of things are wired together, there is already made starter template that has the skeleton for RPC/GRAPHQL/Rest working out of the box with EJS templates.

You can start a new project using the template repo feature on github here:
[Template Repo](https://github.com/AlexMercedCoder/CoquitoJS-Template)

Or you can use npx to generate a new project anywhere using degit.
`npx degit AlexMercedCoder/CoquitoJS-Template`

Just make sure to run `npm install` in the folder and give it a test run to see how it all works and read the notes in the readme and your off to the races with everything working from moment 1.

## CLI & Scaffolding

[CLI DOCUMENTATION](https://www.npmjs.com/package/coquito-cli)

To install the CLI

```
npm install -g coquito-cli
```

You can create a new project with the basic template with the following command.

```
coquito newbasicproject folderName
```

But if you want to pick and choose the parts to scaffold you can start with an empty directory and create a `scaffold.js` and define the following properties.

```json
{
    "graphql": true,
    "rpc": true,
    "routers": [],
    "models": ["Dog", "Cat"],
    "bodyparsers": true,
    "views": "ejs",
    "port": 4444,
    "host": "0.0.0.0",
    "static": "public",
    "package": {
      "name": "my-app",
      "description": "this is my-app",
      "author": "Alex Merced",
      "email": "alexmerced@alexmerced.dev",
      "repo": "http://github.com/..."
    },
    "db": "sql-sqlite3",
    "dburi":"sqlite:database.db",
    "logging": true,
    "methodOverride": true,
    "auth": "sql"
  }
```

The Generated Project will have a readme.md which will have a lot of useful for reference for the scaffolded project.

- graphql (`boolean`): whether to scaffold graphql API
- rpc (`boolean`): whether to scaffold SimpleRPC API
- routers (`Array<String>`): Array of routers to create, this should be for non-model routers
- models (`Array<String>`): Array of models, will generate a model file and rest router for each model.
- bodyparsers (`Boolean`): whether to register json/urlencoded parsing middleware.
- views (`String`): Whether to include server side template and if so which templating language (`["ejs", "pug", "hbs", "liquid", "nunjucks", "mustache","twig","hamlet"]`). If none needed just mark it false.
- port (`String`): port to serve app on (PORT env variable always takes precedence)
- host (`String`): host to serve app on (HOST env variable always takes precendence)
- static (`String` or `boolean`): name of folder to serve static assets, mark false if not needed, if you enable graphql or rpc, a clients.js with premade graphql/rpc client will be added in this folder.
- package (`object`): helps populate package.json with name, description, author, email, repo
- db (`String` or `boolean`): will scaffold specified database from the following options - ["mongo", "sql-pg", "sql-mysql2", "sql-sqlite3", "sql-mariadb", "sql-oracledb", "sql-MSSQL"]
- auth (`String` or `boolean`): will scaffold auth Model, libraries and basic function implementations, values include ["mongo", "sql", false]. This will also add cookie parsing and sessions middleware.
- dburi (`String`): initial value of the DATABASE_URL variable
- logging (`Boolean`): If true will add morgan logging middleware
- methodOverride (`Boolean`): If true will method override middleware.

Then in the same folder run the following command and your project will be scaffolded.

```
coquito scaffold
```

**Additional Scaffolding Commands**

- `coquito add-mongo` scaffold usage of mongo database
- `coquito add-mongo-model modelName` scaffolds model of model by given name
- `coquito add-sql dbtype` scaffolds usage of SQL database of specified type with sequelize. Options: `["pg", "mysql2", "sqlite3", "mariadb", "oracledb", "MSSQL"]`
- `coquito add-sql-model modelName` scaffolds model of model by given name
- `coquito add-rest-routes name` adds controller file with Index, Show, Update, Create and Delete routes defined under given name.
- `coquito add-auth-mongo` adds Model, libraries, and basic function implementations for building auth on mongo
- `coquito add-auth-sql` adds Model, libraries, and basic function implementations for building auth on mongo

## Basic Usage of Coquito Library

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

// destructure routers from app.r
const {sample, example} = app.r

// sample route for sample router
sample.get("/", (req, res) => {
  res.send("I see the samples");
});

// sample route for example router
example.get("/", (req, res) => {
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
], app.r.sample, app.r.sample)

// "/sample/cheese"
app.r.sample.cheese.get(...)

// "/sample/bread"
app.r.sample.bread.get(...)
```

First argument being endpoints you want to routers for, and the second two arguments defining the target router these are subrouters for. (you need both arguments as they have different defaults when registering top level routers)

**What if I need a static server**
Add `static` property to the config object that contains a string with the name of the folder in your project root that should act as your static folder.

```js
const app = new CoquitoApp({
  static: "public",
});
```

**What if I need to configure the application object or define routes before middleware is registered?**

Define a `prehook` property in config with a functions that takes the express app object as an argument and you can do any desired custom express code you want running before Coquito registers middleware and routers.

There is also a `midhook` that can be defined similar to the prehook that runs after registering middleware but before registering graphql/rpc/routers.

```js
import liquid from "liquid-express-views";

function prehook(app) {
  // configure liquid view engine
  liquid(app);
}

const app = new CoquitoApp({
  prehook,
});
```

**Can I access the request and response object from my GraphQL/RPC functions**
Yes, they will be available as context.req and context.res in either paradigm. You can use middleware to store anything in the request or response objects to make it available to all rest/graphql/rpc actions.

graphql

```js
Resolver(parent, args, context, info) {
    console.log(context.req)
    console.log(context.res)
    return "something
  }
```

SimpleRPC

```js
getList: (payload, context) => {
  console.log(context.req);
  console.log(context.res);
  return [1, 2, 3, 4, 5];
};
```

**What if I need to register middleware to the GraphQL or RPC routers?**

You can define a function for the `gqlhook` and `rpchook` properties which run after the router is created but before their route is defined. The signature of the function is.

```
(router) => {}
```

for example...

```js
import liquid from "liquid-express-views";

function gqlhook(gqlrouter) {
  gqlrouter.use(authMiddleware)
}

function rpchook(rpcrouter) {
  rpcrouter.use(authMiddleware)
}

const app = new CoquitoApp({
  gqlhook,
  rpchook
});
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
    console.log(context);
    return [1, 2, 3, 4, 5];
  },

  addToList: (payload, context) => {
    console.log(context);
    return [1, 2, 3, 4, 5, payload.num];
  },
};

export default actions;
```

Here is where we define all our functions that can be called from our client side dispatch calls.

context.js

```js
const context = {};

export default context;
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
    context,
  },
});

// start app
app.listen();
```

Once that is all setup you can make requests either using the simpleRPC client with the "/rpc" endpoint or make post requests to "/rpc" with a body in this shape.

```json
{
  "type": "actionName",
  "payload": {
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
