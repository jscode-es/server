import path from 'path'
import fs from 'fs-extra'
import Language from './language'
import Subdomain from './subdomain'

export default class router
{
    static allowSubdomain = [ 'www', 'panel', 'api', 'img' ] 

    static getRouter( req:any, res:any, next:any )
    {
        // Controller
        let language  = new Language(req)
        let subdomain = new Subdomain(req, router.allowSubdomain)

        // Language client
        language.client()

        // Router subdomain
        subdomain.router()

        // Convert to lowercase method
        req.method = req.method.toLowerCase()

        // Get params
        req.params = router.getParams(req._parsedUrl.pathname)

        // Load controller specific subdomain
        let currentRouter = req.subdomain ?  req.subdomain : 'www'
        let pathController = path.join(String($.router), currentRouter,'controller')

        if(!fs.existsSync(`${pathController}.js`))
        {
            console.log(`[ Router ] This controller not found: ${currentRouter}`)
            return next()
        }

        // TODO: Enrutado de la carpeta de los subdominios



    }

    private static getParams(pathname:any)
    {
        let params       = pathname.split('/').join(' ').trim().split(' ')
        let index        = 0
        let paramsName   = [ 'service', 'page ']  // https://${host}/${service}/${page} ej: https://jscode.es/about/cv
        let objectParams:any = {}

        for (const param of params) 
        {
            if(param.length != 0) 
            {
                if(paramsName[index])
                    objectParams[paramsName[index]] = param
                else
                    paramsName[index] = param
            }

            index++
        }

        return objectParams
    }
}