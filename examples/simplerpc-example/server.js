import CoquitoApp from "../../framework/coquito.js";
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
