import { Server, Socket } from 'socket.io'


export default class socket
{
    static rooms:any
    static io:any
    static list:any 

    constructor(server:any)
    {
        socket.io = new Server(server)

        this.listener()
    }

    private listener()
    {
        let { io } = socket

        io.on("connection", (client: Socket) => {
            
            console.log('[ WEBSOCKET ] Entra cliente')

            setTimeout(() => {

                socket.sendAll('notification',{
                    title:'Ahora en directo',
                    body:'Disfruta de la progamación con JSCode'
                })
                
            }, 5000);

            client.on('disconnect', socket.disconnect )
        })
    }

    private static disconnect()
    {

        //console.log('[ disconnect ]', this)
        
    }

    static sendAll(service:string, data={})
    {
        if(service)
        {
            socket.io.emit(service,data)
        }
    }

    static send()
    {

    }
}