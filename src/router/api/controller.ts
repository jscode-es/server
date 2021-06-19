import {helper} from './../../controller/helper'
import DataBase from './../../controller/database'
import Token from './../../controller/token'
import atob from 'atob'
import Model    from "./../../controller/model"

export default class app
{
    private req:any
    private res:any

    constructor(req:any, res:any, next:any)
    {
        this.req = req
        this.res = res

        this.init()
    }

    private async init()
    {
     
        let { res, req } = this
        let { method, isJsonRequest, headers, 
            params, body, query, files } = req
        

        // Check es ajax method
        if(isJsonRequest)
        {
            // Check is auth allow
            if('authorization' in headers)
            {
                // authorization: 'Basic c2dvbnphbGV6OmRlbW8='
                let auth = headers.authorization.split(' ');

                if(!helper.isBase64(auth[1]))
                {
                    this.res.status(401).json({ code:401, error:'Unauthorized'});
                    return;
                }

                let { code, error, token } = await app.loginByAuth(auth[1])

                return res.status(code).json({error, token})
            }

            console.log('REQUEST => ', { method, isJsonRequest, headers, 
                params, body, query, files })

            let { service } = params
            
            let token = await Token.get(headers.token);

            if(method === 'post' || method === 'put' || method === 'delete')
            {
                if(!app.validateService(service))
                {
                    return this.res.status(404).json({ error:'Service not exist'});
                }

                let { code, error, result } = await app.execute({service,method,body,token,files})

                return this.res.status(code).json({ error, result }); 
            } 


        }

        res.status(404).json({error:'Unauthorized'})
    }

    private static async loginByAuth(data64:string)
    {
        const [ user, pass ] = atob(data64).split(':')

        const db = new DataBase()

        const sql = `SELECT id, pass FROM user WHERE email=:user OR alias=:user LIMIT 1`

        const data = await db.query(sql,{user})

        if(!db.isEmpty())
        {
            if(pass===data[0].pass)
            {
                let info_token =
                {
                    id:data[0].id
                }

                let token = await Token.set(info_token)

                return  {  code:200, error:null, token  }
            }

        }

        return {  code:401, error:'User unauthorized', token:null   }
    }

    // validateServide
    static validateService(service:string)
    {
        let listService = ['publish']

        return listService.includes(service)
    }

    // Método global
    static async execute({service,method,body,token,files}:any)
    {
        let listMethod:any = {put:'update',delete:'remove',post:'save'}

        let { defaultResult, isObjectEmpty} = helper
        
        let { code, error, result } = defaultResult()

        if(!isObjectEmpty(body))
        {
            let control:any  = await Model(service);

            let res = await new control(body,token,files)[listMethod[method]]()

            return { code:res.status, error:res.error, result:res.result }
        }

        return { code, error, result }
    }

 
}