import Swal from 'sweetalert2'

export default class Modal
{
    private static getSetting(otherSetting:any={})
    {
        let setting =
        {
            showCloseButton: true,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInUpBig'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },customClass: {
                popup: 'modal-popup',
                htmlContainer: 'modal-container',
            },
            padding:0,
            width: 900,
            allowOutsideClick:false
        }

        Object.assign(setting,otherSetting)

        return setting
    }

    private static async ajax(service:string)
    {   
        let url:any = `${location.protocol}//${location.host}/${service}`;

        let resolve = await fetch(url)
        let html    = await resolve.text()

        return html
    }

    static async get(service:string, otherSetting:any={})
    {
        if(service && service.length!=0)
        {
            let setting = Modal.getSetting(otherSetting)
            let html    = await Modal.ajax(service)

            Object.assign(setting,{html})

            Swal.fire(setting)
        }
    }
}