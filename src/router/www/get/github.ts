import github from "../../../controller/github";


//that.app.get('/auth/github',github.authenticate());
//that.app.get('/github/callback',github.callback());

export default class github_callback
{
    static async html({page ,res, req}:any)
    {
        console.log('============>',{page,req})

        if(page==='auth')
        {
            return github.authenticate()
        } else {
            return github.callback()
        }

    }

   
}