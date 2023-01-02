import type { Router, Application, RequestHandler } from "express";

interface FlexibleObjectShape {
  [key: string]: any;
}

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
  graphql?: { rootValue: FlexibleObjectShape; schema: string };
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

  registerGraphql(
    options: { rootValue: FlexibleObjectShape; schema: string },
    hook?: Function
  ): void;

  routers(list: Array<String>, target: Routable, root: Routable): void;

  listen(): void;
}

export = CoquitoApp;
