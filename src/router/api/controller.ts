export default class app
{
    constructor(req:any, res:any, next:any)
    {
        res.send('Lanzado desde el subdominio API')
    }
}