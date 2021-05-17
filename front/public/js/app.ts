import socket from './socket'

const APP = () =>
{
    setTimeout(()=>{
        $('.title').addClass('animation')
        $('.subtitle').addClass('animation')
    },500)

    new socket().connection()
}

$(APP)