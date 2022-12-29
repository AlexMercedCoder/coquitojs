const exampleRoutes = (router) => {
    // "/example"
    router.get("/", (req, res) => {
        res.send("you visited /example")
    })
}

export default exampleRoutes