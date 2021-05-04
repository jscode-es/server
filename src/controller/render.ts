const $ = process.env

import pug from 'pug'
import path from 'path'

export default class render
{
    static file(dir:string, params = {})
    {
        dir = path.resolve(`${$.VIEW}/${dir}.pug`)

        return pug.renderFile(dir,params)
    }
}