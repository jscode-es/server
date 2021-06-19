export default class Ajax
{
    static async json(service:string)
    {
        const session:any = window.sessionStorage;

        let setting:any = 
        {
            method: 'GET',
            headers : 
            { 
                'token': session.token,
                'fc-enviroment':'cloud'
            },
            mode: 'cors',
            cache: 'default'
        };
       
        let url:any = `${location.protocol}//${location.host}/${service}`;

        setting.headers['Accept']       = 'application/json';
        setting.headers['Content-Type'] = 'application/json';
        
        let resolve = await fetch(url, setting).then(async data=>{

            let json = await data.json();

            json.status = data.status;
         
            return json;
        }); 

        return resolve; 
    }

  
}