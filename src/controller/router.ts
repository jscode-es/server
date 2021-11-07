// Cargar modulos de Node JS
import fs from "fs-extra"
import path from "path"

// Modulos propio
import Language from "./language"
import Subdomain from "./subdomain"

class Router {
    private static domains: any = {}

    static async getRouter(req: any, res: any, next: any) {

        // Subdominios validos
        let allowSubdomains = ['www']

        // Controladores
        let language = new Language(req)
        let subdomain = new Subdomain(req, allowSubdomains)

        // Idioma del cliente
        language.client()

        // Enrutamiento de los sub dominios
        subdomain.router()

        // Metodo de petición
        req.method = req.method.toLowerCase()

        req.params = Router.getParamsUrl(req._parsedUrl.pathname)

        // Cargar controlador especifico del subdominio
        let route = req.subdomain ? req.subdomain : 'web'
        let pathController = path.join(`${__dirname}/../router/${route}/controller`)

        if (!fs.existsSync(pathController + '.js')) {
            console.log(`[ Router ] This controller not found: ${route}`)
            return next()
        }

        if (Router.domains[route] === undefined) {
            Router.domains[route] = (await import(pathController)).default
        }

        let domains = Router.domains[route]

        new domains(req, res, next)
    }

    static getParamsUrl(pathname: any) {

        let params = pathname.split('/').join(' ').trim().split(' ')
        let paramsObj: any = {}
        let i = 0
        let paramName: any = ['service', 'page']

        for (const param of params) {

            if (param.length != 0) {
                if (paramName[i])
                    paramsObj[paramName[i]] = param
                else
                    paramsObj[i] = param
            }

            i++
        }

        return paramsObj
    }
}

export default Router