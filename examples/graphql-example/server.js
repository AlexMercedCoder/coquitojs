import CoquitoApp from "../../framework/coquito.js";
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
