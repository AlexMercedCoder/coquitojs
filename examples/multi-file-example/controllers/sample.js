const sampleRoutes = (router) => {
    // "/sample"
    router.get("/", (req, res) => {
        res.send("you visited /sample")
    })
}

export default sampleRoutes