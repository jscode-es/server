//Variable de entorno
const $ = process.env;

// Cargar modulos de Node JS
import path from "path"
import fs from "fs"

export default class Language {
    private req: any

    constructor(req: any) { this.req = req }

    client() {

        let req = this.req

        // Recuperar cookie
        let cookies = req.cookies

        // Idioma del cliente
        let languages = (req.get('accept-language') == undefined) ? 'es-es;' : req.get('accept-language')
        let primary = languages.split(';')[0].split('-')[0]

        if (typeof cookies.hasOwnProperty === 'function') {
            req.lang = ('lang' in cookies) ? cookies.lang : primary
            return true;
        }

        req.lang = primary

        return true;
    }

    static getData(lang = 'es') {
        let _path = path.resolve($.root || "", 'i18n', `${lang}.json`)

        if (!fs.existsSync(_path)) {
            _path = path.resolve($.root || "", 'i18n', `en.json`)
        }

        return require(_path)
    }

    static currentLanguage() {
        return ['es', 'en']
    }
}