export default class Api 
{
    url:string          = '';
    service:string      = '';
    setting:any      = {};
    params:any       = {};
    get_params:any = null;

    constructor( service:string , params:object = {} )
    {   
        const session = window.sessionStorage;

        let loc  = location.host.split('.');
        let host = loc[1];

        let route = loc[2] ? `.${loc[2]}` : '';

        this.url = `${location.protocol}//api.${host}${route}/`;
        
        this.setting =
        {
            headers : 
            { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': session.token
            },
            mode: 'cors',
            cache: 'default'
        }

        if(!service) throw 'Required services';

        this.service = service;
        this.params  = params;

    }

    async post ()
    {
        this.setting.method = 'POST';
        this.setting.body   =  JSON.stringify(this.params);

        return await this.json();
    }

    async get ()
    {
        this.setting.method = 'GET';
        this.get_params     = new URLSearchParams(this.params) ;

        return await this.json();
    }

    async put ()
    {
        this.setting.method = 'PUT';
        this.setting.body   =  JSON.stringify(this.params);
        
        return await this.json();
    }

    async delete ()
    {
        this.setting.method = 'DELETE';
        this.setting.body   =  JSON.stringify(this.params);

        return await this.json();
    }

    async patch()
    {
        this.setting.method = 'PATCH';
        this.setting.body   =  JSON.stringify(this.params);

        return await this.json();
    }

    async sendFile(method="POST")
    {   
        let params  :any  = this.params;
        let setting :any = this.setting;
        let formData :any = new FormData();

        for (const key in params) 
        {
            if(key==='files')
            {
                let files = params[key];

                for (const file of files) 
                {
                    formData.append('files[]', file, file.name);  
                }

            } else {
                
                let _data = params[key];

                if(typeof params[key] == 'object')
                {
                    _data = JSON.stringify(params[key]);
                }

                formData.append(key,_data);
            }   
            
        }

        delete setting.mode;
        delete setting.cache;
        delete setting.headers['Content-Type'];
        //delete setting.headers.Accept;

        setting.body = formData;
        setting.method = method;

        this.setting = setting;        

        return await this.json();
    }

    async json()
    {   
        let query = '';
        let params = this.get_params;

        if(params)
        {   
            query=`?${this.get_params}`
        }


        let url     = `${this.url}${this.service}${query}`;
        let setting = this.setting;

        return await fetch(url,setting).then(async data=>{
            
            let json = await data.json();

            json.status = data.status;
         
            return json;
        });
       
    }

    async file()
    {   
        let query = '';
        this.get_params     = new URLSearchParams(this.params) ;

        if(this.get_params)
        {
            query=`?${this.get_params}`
        }

        let url     = `${this.url}${this.service}${query}`;
        let setting = this.setting;

        let result =  await fetch(url,setting).then((data:any)=>{

            if(data.status==200)
            {
                return data.blob();

            } else {

                return false;
            }

        });

        return result
    }

    toObject()
    {
        return { setting: this.setting, service :this.service , params :this.params}
    }
}


