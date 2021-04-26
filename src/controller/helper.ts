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
}