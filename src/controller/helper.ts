import btoa from 'btoa'
import atob from 'atob'

export class helper
{
    static isString(data:any):boolean
    {
        return typeof data === 'string'
    }

    static isStringEmpty(data:any):boolean
    {
        return data.length === 0
    }

    static stringLowerCase(data:any):string
    {
        return new String(data).toLowerCase()
    }

    static isBase64(data:any)
    {
        try {

            return btoa(atob(data)) == data
            
        } catch (error) {
            
            return false
        }
    }

    static isValidate(schema:any, data:any)
    {
        let setting =
        {
            abortEarly: false,
            convert: true,
            allowUnknown: true,
            stripUnknown: true,
            skipFunctions: true
        }

        return schema.validate(data , setting);
    }

    static defaultResult()
    {
        return { code: 500, error:'Internal Server Error', result:null }
    }

    static isObjectEmpty(data:any)
    {
        return Object.keys(data).length === 0
    }
}