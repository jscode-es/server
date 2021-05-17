import render from './../../../controller/render'
import database from './../../../controller/database'

export default class news
{
    static async html(page:string)
    {
        let html = ''

        // ALL NEWS
        if(!page)
        {
            html = render.file('www/news')
        
            return html
        }

        // CURRENT NEW
        let publish = await news.getPublish(page)

        // IF NOT EXIT ; REDIRECT TO PATH
        if(publish.length===0)
        {
            return false
        }
        
        html = render.file('www/current_new',{ publish })
        
        return html
    }

    private static async getPublish(url:string)
    {
        let db = new database()

        let sql = `SELECT b.id, b.title, b.subtitle, b.content, b.portrait, b.created, b.url, bt.name AS blog_type FROM blog b
        INNER JOIN blog_type bt ON b.blog_type = bt.id
        WHERE b.isVisible = 1 AND url = '${url}'
        LIMIT 1`

        let res = await db.query(sql, {url})

        return res
    }


}