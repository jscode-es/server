import render from './../../../controller/render'
import database from './../../../controller/database'

export default class index
{
    static async html()
    {
        let publish = await index.getPublish()

        let html = render.file('www/index',{ publish })
        
        return html
    }

    private static async getPublish()
    {
        let db = new database()

        let sql = `SELECT b.id, b.title, b.subtitle, b.portrait, b.created, b.url, bt.name AS blog_type FROM blog b
        INNER JOIN blog_type bt ON b.blog_type = bt.id
        WHERE b.isVisible = 1
        ORDER BY b.created DESC 
        LIMIT 4`

        let res = await db.query(sql)

        return res
    }
}