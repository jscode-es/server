import pug from 'pug'

export default class render {
    static pug(dir: any, options = {}) {
        return pug.renderFile(dir, options)
    }
}