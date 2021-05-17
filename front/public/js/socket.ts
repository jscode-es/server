import notification from './notification'

export default class socket
{
    private static setting:any = {}
    private static server:any = null

    constructor()
    {
        socket.server = io(socket.getSetting())
    }

    connection()
    {
        let that = this
        let { server } = socket

        server.on('notification', data => that.notification(data) )
    }

    private static getSetting()
    {
        let setting =
        {
            forceNew:true,
            transportOptions:
            {
                polling:
                {
                    extraHeaders:{  type_client:'web' }
                }
            }
        }

        return setting
    }

    private notification(data:any)
    {
        console.log('[ notification ]',data)
        new notification(data)
    }

}