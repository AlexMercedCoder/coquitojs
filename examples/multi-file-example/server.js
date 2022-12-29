import CoquitoApp from "../../framework/coquito.js";
import sampleRoutes from "./controllers/sample.js";
import exampleRoutes from "./controllers/example.js";

// create application, define routers,middleware, port, host
const app = new CoquitoApp({
    port: 4000,
    bodyparsers: true,
    host: "localhost",
    routers: ["/sample", "/example"],
    middleware: [
        (req, res, next) =>  {console.log(req.method, req.url, req.headers); next();}
    ]
})

sampleRoutes(app.sample)
exampleRoutes(app.example)

app.listen()
