import express from "express"
import {log} from mercedlogger

export class CoquitoApp {

    constructor(config = {}){

        const middlware = config.middleware || []
        const routers = config.routers || []
        const port = config.port || "3333"
        

        this.app = express()
        this.host = config.host || "localhost"
        this.port = process.env.PORT || port
        this.registerMiddleware(middleware)
        this.routers(routers)
    }

    routers(list = []){
        for (item of list){
            const parts = item.split("/")
            if (parts.length < 2 || parts.length > 2){
                throw("Should be list of one part paths -> ['/path','/path2']")
            }
            const path = parts[1]
            this[path] = express.Router()
            this.app.use(parts.slice(0,2).join("/"), this[path])
        }
    }

    registerMiddleware(list = [], target = this.app){
        for (item of list){
            target.use(item)
        }
    }

    listen(){
        this.app.listen(this.port, this.host, () => {
            log.green("Server Status", `Server running on port ${this.port}`)
        })        
    }
}