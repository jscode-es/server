export default class language
{
    private req:any
    static accepted = 'accept-language'

    constructor(req:any)
    {
        this.req = req
    }

    client()
    {
        let req = this.req
        
        // Recover cookies
        let { cookies } = req

        // Language client
        let languages = (req.get(language.accepted) === undefined ) ? 'en-en' : req.get(language.accepted)
        let primary   = languages.split(';')[0].split('-')[0]

        if(typeof cookies.hasOwnProperty === 'function')
        {
            req.lang = (cookies.hasOwnProperty('lang')) ?  cookies.lang : primary
            return
        }

        req.lang = primary
        
        return

    }
}