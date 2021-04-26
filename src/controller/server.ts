import { ISettingServer } from "./interface/i_setting_server"
import { helper } from "./helper"

const { isString, isStringEmpty, stringLowerCase } = helper

export default class server
{
    private static HTTP2:string = 'http2'
    private setting?:ISettingServer 

    constructor( type:string=server.HTTP2, options:object={} )
    {   
        if(isString(type) && !isStringEmpty(type))
        {
            // Inicialize setting
            this.setSetting(options)

            // Create server
            this.create(stringLowerCase(type))
        }
    }

    // Set setting server
    private setSetting(options:object|ISettingServer|undefined):void
    {
        let _default:ISettingServer =
        {
            forceSSL:true,
            extended:false,
            port:80, // 80
            portSecure:443, //433
            limit:'50mb'
        }

        Object.assign(_default, options)

        this.setting = _default
    }

    // Create server
    private async create(typeServer:string)
    {
        // Override force ssl
        this.setRequiredSSL(typeServer)

        // Path type server
        let dir = `./type_server/${typeServer}`

        //TODO: Check file exist

        let controller = await(await import(dir)).default

        if(typeof controller === 'function')
        {
            new controller(this.getSetting())
        }

    }

    // Require force SSL
    private setRequiredSSL(typeServer:string)
    {
        let typeServerList = [ 'https', 'http2', 'ftps', 'wss' ]

        if( typeServerList.indexOf(typeServer) != -1 )
        {
            let setting = this.getSetting()

            Object.assign(setting, { forceSSL: true })

            this.setSetting(setting);
        }
    }

    // Get setting server
    private getSetting():ISettingServer | undefined
    {
        return this.setting
    }
}