const $ = process.env

import passport from 'passport'
import { Strategy } from 'passport-github'

export default class github
{
    static authenticate()
    {
        let setting =
        {
            clientID: String($.GITHUB_CLIENT_ID),
            clientSecret: String($.GITHUB_CLIENT_SECRET),
            callbackURL: "https://localhost/github/callback"
        }

        passport.use(new Strategy(setting,github.resolve))

        return passport.authenticate('github')
        
    }

    static resolve(accessToken:any, refreshToken:any, profile:any, cb:any)
    {
        console.log('[ github ] resolve')
        console.log({accessToken, refreshToken, profile})

        return cb(null,profile)
    }

    static async callback()
    {
        console.log('[ github ] callback')
        return passport.authenticate('github', { failureRedirect: '/' }, (req:any,res:any)=>{
            console.log('[ github ] callback authenticate')
            res.redirect('/');
        })
    }


}