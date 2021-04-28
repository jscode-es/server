const $ =  process.env

import isIp from 'is-ip'

export default class subdomain
{
    private req:any
    private subdomains:any

    constructor(req:any, allowSubdomain:object)
    {
        this.req     = req
        this.subdomains = allowSubdomain
    }

    router()
    {
        let { req, subdomains } = this

        let def_host      = 'localhost'
        let def_subdomain = subdomains[0]

        if(!isIp(req.headers.host)) // host: 127.0.0.1:433 or jscode.es
        {
            def_host = req.headers.host.split(':')[0]
        }

        let sub = def_host.split('.')

        let subLen = ( $.NODE_ENV && $.NODE_ENV === 'development' ) ? 2 : 3

        def_subdomain = sub.length === subLen ? sub[0] : def_subdomain
        
        // Check subdomain not exist ?
        if(subdomains.indexOf(def_subdomain)=== -1 && sub.length >= subLen)
        {
            return false
        }

        // set subdomain
        req.subdomain = def_subdomain

        return true
    }
}