import type { Router, Application, RequestHandler } from "express";
import type { GraphQLArgs } from "graphql";

type Routable = Router | Application;
type RouterHook = (router: Routable) => void;
interface CoquitoAppConfig {
  port?: Number;
  bodyparsers?: Boolean;
  host?: String;
  routers?: Array<String>;
  middleware?: Array<RequestHandler>;
  prehook?: RouterHook;
  midhook?: RouterHook;
  gqlhook?: RouterHook;
  rpchook?: RouterHook;
  graphql?: GraphQLArgs;
  rpc?: { actions: Object; context: Object };
}

interface Routers {
  [key: string]: Router;
}

declare class CoquitoApp {
  constructor(config: CoquitoAppConfig);

  readonly app: Application;
  host: String;
  port: Number;
  r: Routers;

  registerMiddleware(middleware: Array<RequestHandler>): void;

  registerRPC(options: Object, hook?: Function): void;

  registerGraphql(options: GraphQLArgs, hook?: Function): void;

  routers(list: Array<String>, target: Routable, root: Routable): void;

  listen(): void;
}

export = CoquitoApp;
