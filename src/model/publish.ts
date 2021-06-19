const $ = process.env

import joi from 'joi'
import DataBase from '../controller/database'
import {helper} from '../controller/helper'

const db     = new DataBase()

export default  class Publish
{   
    private data:any
    private token:any
    private files:any

    constructor(data:any,token:any,files:any)
    {
        this.data   = data
        this.token  = token
        this.files  = files
    }

    private static schema()
    {
        let setting =
        {  
            title:    joi.string().trim().min(1).max(80).required(),
            subtitle: joi.string().trim().max(80).allow(''),
            url:      joi.string().trim().min(1).required(),
            markdown: joi.string().trim().required(),
            language: joi.number().default(1),
            blog_type: joi.number().default(1)
        }

        return joi.object(setting);
    }

    async save()
    {
        let { data,token,files }:any = this;
        let { local, company }      = token;

        console.log(data,files)

        data.local = local

        let schema = Publish.schema();

        let { error, value } = helper.isValidate(schema,data);

        console.log({ error, value })

        if(error)
        {
            return { status:400, error:error.details[0].message, result:null };
        }

        await db.add('blog', value);

        if(db.isSuccess())
        {
            return { status:200, error:null, result:db.getId() };
        }

        return { status:500, error:'Could not insert', result:null}

    }

    static async update(id:any,data:any,verify = false)
    {
        if(id && data)
        {   
            // Si verify esta en true, quiere decir que
            // esta actualizado y activando el usuario
            if(!verify) 
            {
                let schema :any= Publish.schema();
    
                let { error, value } = schema.isValidate(schema,data);
    
                if(error)
                {
                    return { status:400, error:error.details[0].message, result:null };
                }

                data = value;
            }

            await db.update('user',{ set:data, where:{id} });

            return { status:200, error:'', result:{id}}
        }

        return { status:404, error:'Article not found', result:null }
    }

    static async remove({id}:any)
    {
        if(id)
        {
            //Article.removeFolder(id);

            await db.remove('user',{ where:{id} });

            return { status:200, error:'', result:{id}}
        }

        return { status:404, error:'Article not found', result:null }
    }

    static get(data:any)
    {
        let schema:any = Publish.schema();

        let { error, value } = schema.isValidate(schema,data);

        if(error) return { status:500, error, result:null };

    }
}