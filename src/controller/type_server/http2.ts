// Enviorenment system
const env = process.env

import { ISettingServer } from "./../interface/i_setting_server"

// Node module
import fs from 'fs-extra'
import path from 'path'

// Module required
import express from 'express'
import spdy from 'spdy'
import cookie from 'cookie-parser'
import session from 'express-session'
import compression from 'compression'
import cors from 'cors'
import socket from './websocket'
import passport from "passport"
import { Strategy } from 'passport-github'

// Store ram
import redis from 'redis'
import redisConnect from 'connect-redis'

const redisClient = redis.createClient()
const redistStore = redisConnect(session)

import router from './../router'
import twitch from './../twitch'
import youtube from '../youtube'
import github from '../github'

export default class http2
{
    private app:any
    private setting?:ISettingServer
    private server:any

    constructor(setting:ISettingServer)
    {
        // Create express aplication
        this.app = express()

        // Set setting
        this.setting =  setting

        // Launcher
        this.launch()
    }

    launch()
    {
        console.log('[ HTTP2 ] Launch ...')

        let setting = this.setting

        let cert:any = http2.getCerticate()

        if(cert.error)
        {   
            console.log('[ HTTP2 ] Error: '+cert.error)
            return
        }
 
        // Create server spdy/http2
        this.server = spdy.createServer(cert, this.app)

        // Force SSL
        setting?.forceSSL && this.app.use(this.forceSSL)

        // Request type JSON
        this.app.use(this.isJsonRequest)

        // Ip client
        this.app.use(this.setIpClient)

        // Cookie
        this.app.use(cookie())

        // Setting session
        let settingSession:any =
        {
            secret: String(env.SECRET_SESSION),
            store: new redistStore({ client:redisClient}),
            name:'jscode',
            resave:false,
            cookie: { secure:true },
            saveUninitialized:true
        }

        // Session
        this.app.use(session(settingSession))

        // Compression
        this.app.use(compression())

        // Content static
        this.contentStatic()

        // Limit trafic json
        this.app.use(express.json({limit:setting?.limit}))

        // Form
        this.app.use(express.urlencoded({extended:setting?.extended}))

        // Cors
        this.cors()

        // Secure
        this.app.use(this.secure)
        this.app.disable('x-powered-by')
        this.app.disable('etag')

        // render sistem
        this.app.set('view', String(env.view))
        this.app.set('view engine', 'pug')

        // Listener to server
        this.listener()

    }

    private static getCerticate():object
    {
        let cert = path.resolve(String(env.CERT))
        let key  = path.resolve(String(env.CERT_KEY))
        let ca   = path.resolve(String(env.CERT_CA))

        let { error }:any =  http2.isCertExist([cert,key,ca])

        if( error == null )
        {
            return {
                cert: fs.readFileSync(cert),
                key: fs.readFileSync(key),
                ca: fs.readFileSync(ca),
                requestCert:true,
                rejectUnauthorized:false
            }
        }


        return { error }
    }

    private static isCertExist(certs:object):any
    {
        let error = null

        if(Array.isArray(certs))
        {
            for (const cert of certs) 
            {   
                if(!fs.existsSync(cert))
                {
                    error = `This cert has not been found --> ${cert}`
                    break;
                }
            }
        }

        return { error }
    }

    private forceSSL( req:any, res:any, next:any )
    {
        if(!req.secure)
        {
            return res.redirect(`https://${req.headers.host}${req.url}`)
        }

        next()
    }

    private isJsonRequest( req:any, res:any, next:any )
    {
        req.isJsonRequest = function()
        {
            return req.xhr || /json/i.test(req.headers.accept)
        }

        req.isJsonRequest = req.isJsonRequest()

        next()
    }

    private setIpClient( req:any, res:any, next:any )
    {
        req.ipClient = req.headers['x-forwarded-for'] || req.connection.remoreAddres

        next()
    }

    private contentStatic()
    {
        let content = express.static('public', { etag:false, dotfiles:'allow'})

        this.app.use(content)
    }
    
    private cors()
    {
        let options:any =
        {
            origin:'*',
            optionsSuccessStatus:200
        }

        this.app.use(cors(options))
    }

    private secure( req:any, res:any, next:any )
    {
        let nowAllow = [ 'php', 'cli', 'aps' ]

        let url  = req.url.split('/')
        let last = url[url.length-1]
        let file = last.split('.')
        let ext  = file[file.length-1]

        if(nowAllow.indexOf(ext)!=-1)
        {
            return res.send('not allow')
        }

        next()
    }

    private redirectToSSL()
    {
        let {  setting }  = this 

        express()
        .get('*', (req, res) => res.redirect(`https://${req.headers.host}${req.url}`))
        .listen(setting?.port)
    }

    private listener()
    {
        let that        = this
        let { server, setting }  = that 

        let port = setting?.forceSSL ? setting.portSecure : setting?.port

        if(setting?.forceSSL)
        {
            this.redirectToSSL()
        }

        server.listen(port, String(env.IP), ()=>{

            // Set Router
            // https://jscode.es/about
            new socket(server)

            that.app.use(passport.initialize())
            that.app.use(passport.session())

            let setting =
            {
                clientID: String(env.GITHUB_CLIENT_ID),
                clientSecret: String(env.GITHUB_CLIENT_SECRET),
                callbackURL: "https://localhost/github/callback"
            }

            passport.serializeUser((user:any,cb:any)=>{
                cb(null,user.id)

            })

            passport.deserializeUser((id:any,cb:any)=>{
                cb(null,id)

            })

            passport.use(new Strategy(setting,github.resolve))
            
            that.app.get('/github/auth',passport.authenticate('github'));

            that.app.get('/github/callback', 
            passport.authenticate('github', { failureRedirect: '/' }),
            function(req:any, res:any) {
                // Successful authentication, redirect home.
                res.redirect('/');
            });

            let isAuth = (req:any,res:any,next:any)=>
            {
                if(req.user)
                {   console.log('Continue==========')
                    next()
                } else {
                    console.log('Redirect==========')
                    res.redirect('/')
                }
            }
            
            that.app.use('/', isAuth, router.getRouter )

            that.app.use(this.error)

        })
        
    }

    private error( req:any, res:any, next:any )
    {
        res.status(404).send('Sorry cant find that !')
    }

}