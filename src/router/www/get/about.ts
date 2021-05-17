import database from './../../../controller/database'

export default class index
{
    static async html()
    {
        //console.log(database)

        
        let db = new database()
        
        /*let sql = 
        {
            values:['id','name','name:nickname'],
            where:{ id:1, name:['hola','adios']}
        }
        
        // SELECT id, name, name AS nickname FROM user WHERE id = 1 AND ( name='hola' OR name= 'adios ')
        
        let data = await db.findAll('user', sql)
        
        if(db.isEmpty())
        {
            
        } else {
            
        }*/
        
        return '<h1>Pagina about</h1>'
    }
}