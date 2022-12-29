import CoquitoApp from "../../framework/coquito.js";

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

// sample route for sample router
app.sample.get("/", (req, res) => {
    res.send("I see the samples")
})

// sample route for example router
app.example.get("/", (req, res) => {
    res.send("I see the examples")
})

// turn on listener
app.listen()