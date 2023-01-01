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
  contructor(config: CoquitoAppConfig);

  readonly app: Any;
  host: String;
  port: Number;
  r: Object;

  registerMiddleware(middleware: Array<Function>);

  registerRPC(options: Object, hook?: Function);

  registerGraphql(options: Object, hook?: Function);
}

export = CoquitoApp;