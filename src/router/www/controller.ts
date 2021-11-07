// Environment variable
const $ = process.env

// Loading Node JS modules
import path from "path"
import fs from "fs"

// Load controller
import render from "@controller/render"

export default class Controller {

    private req: any
    private res: any

    constructor(req: any, res: any) {

        this.req = req
        this.res = res

        this.init()
    }

    async init() {

        let { res, req } = this

        // Request data
        let { method, params, isJsonRequest, query } = req

        let html = ''

        // Service
        let { service } = params

        // Check request service
        if (service) {

            method = method.toLowerCase()
            service = service.toLowerCase().trim()

            let { directory, directoryJS } = Controller.getDir(method, service)

            if (isJsonRequest) {

                let data = {}

                if (fs.existsSync(`${directoryJS}.js`)) {

                    let control = (await import(directoryJS)).default

                    data = await control.json({ req })

                }

                return res.json(data)
            }


            if (fs.existsSync(directory)) {

                let data = {}

                if (fs.existsSync(`${directoryJS}.js`)) {

                    let control = (await import(directoryJS)).default

                    data = await control.getContent({ query, params })
                }

                html = render.pug(directory, data)

                return res.send(html)
            }

            return res.redirect('/')

        }

        // Cargar página de inicio
        if (!isJsonRequest && service === undefined) {

            let { directory, directoryJS } = Controller.getDir(method, 'index')

            if (fs.existsSync(directory)) {

                let data = {}

                if (fs.existsSync(`${directoryJS}.js`)) {

                    let control = (await import(directoryJS)).default

                    data = await control.getContent({ query, params })
                }

                html = render.pug(directory, data)

                return res.send(html)
            }
        }

        return res.status(404).send('Not found')
    }

    static getDir(method: any, service: any) {

        let index = (service === 'index') ? '' : 'page/'

        let directory = path.resolve(`${$.view}/www/${index}${service}.pug`)
        let directoryJS = path.resolve(`${$.web}/${method}/${service}`)

        return { directory, directoryJS }
    }

}