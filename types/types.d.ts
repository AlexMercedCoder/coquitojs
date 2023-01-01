import type {Router, Application, RequestHandler} from "express"

type Routable = Router|Application

interface CoquitoAppConfig {
  port?: Number;
  bodyparsers?: Boolean;
  host?: String;
  routers?: Array<String>;
  middleware?: Array<Function>;
  prehook?: (expressApp: any) => {};
  midhook?: (expressApp: any) => {};
  gqlhook?: (graphqlRouter: any) => {};
  rpchook?: (rpcRouter: any) => {};
  graphql?: { rootValue: Object; schema: String };
  rpc?: { actions: Object; context: Object };
}

interface Routers {
  [key: string]: Router
}

declare class CoquitoApp {
  constructor(config: CoquitoAppConfig);

  readonly app: Application;
  host: String;
  port: Number;
  r: Routers;

  registerMiddleware(middleware: Array<RequestHandler>):void;

  registerRPC(options: Object, hook?: Function):void;

  registerGraphql(options: Object, hook?: Function):void;

  routers(list: Array<String>, target: Routable, root: Routable):void;

  listen():void;
}

export = CoquitoApp;
