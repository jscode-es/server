import render from './../../../controller/render'

export default class index
{
    static async html()
    {
        let html = render.file('www/form/login-register',{login:true})
        
        return html
    }
}