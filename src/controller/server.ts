// Environment variable
const $ = process.env

// Loading Node JS modules
import path from "path"
import fs from "fs-extra"

//Type Server
enum Types {
    HTTP,
    HTTPS,
    HTTP2,
    HTTP3
}

// Main class
class Server {

    static Types = Types

    constructor(mode: any) {

        this.create(Server.Types[mode])
    }

    // Create server
    private async create(type_server: any) {

        let type: string = String(type_server).toLowerCase()

        let dir = path.resolve($.services as string, `${type}.js`)

        console.log(`[ SERVER ] ${type}...`)

        if (fs.existsSync(dir)) {

            let service = await (await import(dir)).default

            return new service()
        }
    }
}

export default Server
