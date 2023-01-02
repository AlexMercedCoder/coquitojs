import type { Router, Application, RequestHandler } from "express";
import type {ActionCollection, ActionContext} from "@alexmerced/simplerpc-server"

export interface FlexibleObjectShape {
  [key: string]: any;
}

export interface RPCConfig { 
  actions: ActionCollection; 
  context: ActionContext 
}

export type Routable = Router | Application;
export type RouterHook = (router: Routable) => void;
export interface CoquitoAppConfig {
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
  rpc?: RPCConfig;
}

export interface Routers {
  [key: string]: Router;
}

declare class CoquitoApp {
  constructor(config: CoquitoAppConfig);

  readonly app: Application;
  host: String;
  port: Number;
  r: Routers;

  registerMiddleware(middleware: Array<RequestHandler>): void;

  registerRPC(RPCConfig, hook?: RouterHook): void;

  registerGraphql(
    options: { rootValue: FlexibleObjectShape; schema: string },
    hook?: RouterHook
  ): void;

  routers(list: Array<String>, target: Routable, root: Routable): void;

  listen(): void;
}

export default CoquitoApp;
