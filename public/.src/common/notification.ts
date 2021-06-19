export default class notification
{
    static GRANTED = 'granted'
    static DENIED  = 'denied'
    static PAUSE   = false
    private data   = { body:'Cuerpo del mensaje', icon:'', title:''}

    constructor(data:any)
    {   
        this.data = data

        notification.PAUSE && this.send()
    }   

    send()
    {
        let that = this
        let { title } = this.data  

        if (!("Notification" in window)) 
        {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === 'granted' ) {

            new Notification(title,that.getSetting());
        }
        else if (Notification.permission !== 'denied') {

            Notification.requestPermission(function (permission) {
                
                if (permission === "granted") 
                {
                    new Notification(title, that.getSetting());
                } 
            });
        }

    }

    getSetting():any
    {
        let { body, icon } = this.data  

        return { body, icon }
    }
}