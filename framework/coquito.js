import express from "express";
import { log } from "mercedlogger";
import { graphql, buildSchema } from "graphql";
import createHandler from "@alexmerced/simplerpc-server";
class CoquitoApp {
  constructor(config = {}) {
    const middleware = config.middleware || [];
    const routers = config.routers || [];
    const port = config.port || "3333";
    const host = config.host || "localhost";
    const emptyFunc = () => {}
    const gqlhook = config.gqlhook || emptyFunc;
    const rpchook = config.rpchook || emptyFunc;

    if (config.bodyparsers) {
      middleware.push(express.json());
      middleware.push(express.urlencoded({ extended: true }));
    }

    if (config.static) {
      middleware.push(express.static(config.static));
    }

    this.app = express();

    if (config.prehook) {
      config.prehook(this.app);
    }

    this.r = {}

    this.host = process.env.HOST || host;
    this.port = process.env.PORT || port;
    this.registerMiddleware(middleware);

    if (config.midhook) {
      config.midhook(this.app);
    }

    config.graphql ? this.registerGraphql(config.graphql, gqlhook) : null;
    config.rpc ? this.registerRPC(config.rpc, rpchook) : null;
    this.routers(routers);
  }

  routers(list = [], target = this.app, root = this.r) {
    for (let item of list) {
      const parts = item.split("/");
      if (parts.length < 2 || parts.length > 2) {
        throw "Should be list of one part paths -> ['/path','/path2']";
      }
      const path = parts[1];
      root[path] = express.Router();
      target.use(parts.slice(0, 2).join("/"), root[path]);
    }
  }

  registerMiddleware(list = [], target = this.app) {
    for (let item of list) {
      target.use(item);
    }
  }

  registerGraphql({ rootValue, schema }, gqlhook = () => {}) {
    this.r.graphql = express.Router();

    const compiledSchema = buildSchema(schema);

    gqlhook(this.r.graphql);

    this.r.graphql.all("*", async (req, res) => {
      try {
        const result = await graphql({
          rootValue,
          schema: compiledSchema,
          source: req.body.query,
          contextValue: { req, res },
        });
        res.json(result);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.app.use("/graphql", this.r.graphql);
  }

  registerRPC({ actions, context }, rpchook = () => {}) {
    this.r.rpc = express.Router();
    this.rpchandler = createHandler({ actions, context });

    rpchook(this.r.rpc);

    this.r.rpc.all("*", async (req, res) => {
      try {
        context.req = req;
        context.res = res;
        const result = await this.rpchandler(req.body);
        res.json(result);
      } catch (error) {
        res.status(400).json({ error });
      }
    });

    this.app.use("/rpc", this.r.rpc);
  }

  listen() {
    this.app.listen(this.port, this.host, () => {
      log.green("Server Status", `Server running on port ${this.port}`);
    });
  }
}

export default CoquitoApp;
