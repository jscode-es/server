// Environment variable
const $ = process.env

// Loading Node JS modules
import path from "path"
import fs from "fs-extra"

// Modules required for the server
import express from "express"
import https from "https"
import cookie from "cookie-parser"
import cors from "cors"
import session from "express-session"
import compression from "compression"
import fileUpload from "express-fileupload"
import Router from "@controller/router"

const device = require('express-device')

// Ram storage
import redis from "redis"
import resdisStore from "connect-redis"

const client = redis.createClient()
const store = resdisStore(session)

const setting: any =
{
    forceSSL: true,
    limit: '50mb',
    extended: false,
    port: 80,
    portSecure: 443
}

const setting_session: any =
{
    secret: $.SECRET_SESSION || "",
    store: new store({ client }),
    name: 'farmaconnect',
    //proxy: true,
    resave: false,
    cookie: { secure: false },
    saveUninitialized: true
}

class Service {

    private app: any
    private server: any

    constructor() {

        // Application
        this.app = express()

        // Initialitze
        this.start()
    }

    private start() {

        let certificate = Service.getCertificate()

        if (certificate.error) {
            console.log('[ ERROR ] Certificate: ', certificate.error)
            return false;
        }

        let { forceSSL, limit, extended } = setting

        // Server
        this.server = https.createServer(certificate, this.app)

        // Detectar dispositivo
        this.app.use(device.capture())

        // Forzar ssl
        forceSSL && this.app.use(this.forceSSL)

        // Peticiones JSON
        this.app.use(this.isJsonRequest)

        // Ip del cliente
        this.app.use(this.setIpClient)

        // Favicon
        this.favicon()

        // Cookie
        this.app.use(cookie())

        // Session
        this.app.use(session(setting_session))

        // Favicon
        this.app.use(compression())

        // Contentido estatico
        this.contentStatic()

        this.app.use(fileUpload())

        // Limite de trafico
        this.app.use(express.json({ limit }))

        // Fomularios
        this.app.use(express.urlencoded({ extended }))

        // Parser aplicaciones CORS
        this.cors()

        // Seguridad
        this.app.use(this.secure)
        this.app.disable('x-powered-by')
        this.app.disable('etag')

        // Sistema de renderizado
        this.app.set('views', $.view)
        this.app.set('view engine', 'pug')

        // listener
        this.listener()

        return true

    }

    private static getCertificate() {

        let cert = path.resolve($.CERT || "")
        let key = path.resolve($.CERT_KEY || "")
        let ca = path.resolve($.CERT_CA || "")

        let { error } = Service.isCertificateExist([cert, key, ca])

        if (error == null) {
            return {
                cert: fs.readFileSync(cert),
                key: fs.readFileSync(key),
                ca: fs.readFileSync(ca),
                requestCert: true,
                rejectUnauthorized: false
            }
        }

        return { error }
    }

    private static isCertificateExist(certificates: string[]) {
        let error = null

        for (const cert of certificates) {

            if (!fs.existsSync(cert)) {
                error = `This certificate has not been found -> ${cert}`
                break
            }
        }

        return { error }
    }

    private forceSSL(req: any, res: any, next: any) {

        if (!req.secure) {
            return res.redirect("https://" + req.headers.host + req.url)
        }

        next()
    }

    private secure(req: any, res: any, next: any) {
        res;
        let nowAllow = ['php', 'cli', 'asp']

        let url = req.url.split('/')
        let last = url[url.length - 1]
        let file = last.split('.')
        let ext = file[file.length - 1]

        if (nowAllow.indexOf(ext) != -1) {
            //return new Response(res).notAuth();
        }

        next()
    }

    private isJsonRequest(req: any, res: any, next: any) {
        res;
        req.isJsonRequest = function () {

            return req.xhr || /json/i.test(req.headers.accept)
        };

        req.isJsonRequest = req.isJsonRequest()

        next()
    }

    // Ip del cliente
    private setIpClient(req: any, res: any, next: any) {
        res;
        req.ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        next()
    }

    // Parser aplicaciones CORS
    private cors() {

        let options =
        {
            origin: '*', // Reemplazar con dominio
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }

        this.app.use(cors(options))
    }

    // Favicon
    private favicon() {
        //this.app.use(favicon($.contentPublic + '/favicon.ico'))
    }

    // Contenido estatico
    private contentStatic() {

        let content = express.static($.public as string, { etag: false, dotfiles: 'ignore' })

        this.app.use('/', content)
    }

    private redirectSSL() {
        express()
            .get('*', (req, res) => res.redirect("https://" + req.headers.host + req.url))
            .listen(80)

    }

    private listener() {

        let that = this

        let { server } = that

        let { port, portSecure, forceSSL } = setting

        let _port = forceSSL ? portSecure : port

        if (forceSSL) this.redirectSSL()

        // Escuchar servicio
        server.listen(_port, $.IP, () => {

            console.log(`[ Server ] ${$.IP}:${_port}`)

            // Enrutamiento
            that.app.use('/', Router.getRouter)

            // Realtime
            //new socket(server)

            // Controlador de errores
            that.app.use((req: any, res: any, next: any) => {
                req; next;
                res.status(404).send('Sorry cant find that!')
            })

        })
    }
}

export default Service