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

declare class CoquitoApp {
  constructor(config: CoquitoAppConfig);

  readonly app: any;
  host: String;
  port: Number;
  r: Object;

  registerMiddleware(middleware: Array<Function>):void;

  registerRPC(options: Object, hook?: Function):void;

  registerGraphql(options: Object, hook?: Function):void;

  routers(list: Array<String>, target: any, root: any):void;

  listen():void;
}

export = CoquitoApp;
