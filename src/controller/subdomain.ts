const $ = process.env

// Modulos de terceros
import isIp from "is-ip"

export default class Subdomain {

    private req: any
    private domains: any

    constructor(req: any, domains: any) {
        this.req = req
        this.domains = domains
    }

    // Detectar si hay un subdominio permitido
    router() {

        let req = this.req
        let domains = this.domains
        let host = 'localhost' // Default
        let subdomain: any = 'www' // Enrutamiento 

        if (!isIp(req.headers.host)) {
            if (req.headers.host) {
                host = req.headers.host.split(':')[0]
            }
        }

        let sub = host.split('.')

        let subLength = ($.NODE_ENV && $.NODE_ENV == 'development') ? 2 : 3

        subdomain = sub.length == subLength ? sub[0] : subdomain

        if (domains.indexOf(subdomain) == -1 && sub.length >= subLength) {
            return false
        }

        // Set subdomain
        req.subdomain = subdomain

        return true
    }

}