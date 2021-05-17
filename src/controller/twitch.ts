const $ = process.env

import fetch from 'node-fetch'

export default class twitch
{
    private static ID     = $.TWITCH_ID
    private static SECRET = $.TWITCH_SECRET
    private static TOKEN  = null

    static URI = `https://id.twitch.tv/oauth2/token?client_id=az87j05yuqaz031jitpuyaktyfrdmx&client_secret=5fpvmquxomt1l9chztkpuqjj9q7a5q&grant_type=client_credentials&scopes=user:edit%20user:read:email`

    static async test()
    {
        console.log('[ twitch ]',twitch.URI) 

        let setting:any = 
        {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'token_type': 'bearer'
                //'client-id':twitch.ID,
                //'Authorization':`Bearer ${twitch.SECRET}`
            }
        }        

        let data = await fetch(twitch.URI, setting)
        .then(res =>{
            
            if(res.status === 200)
            {
                return res.json()
            }
           
            return false

        }) // expecting a json response
        
        console.log('[ twitch ] data',{data});

        if(data)
        {
            twitch.TOKEN =  data.access_token

            setting = 
            {
                method: 'GET', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Client-ID':twitch.ID,
                    'Authorization':`${data.token_type} ${data.access_token}`
                }
            } 

            console.log(setting);
            

            let rest = await fetch('https://api.twitch.tv/helix/search/channels?query=a_seagull', setting)
            .then(res =>{
                
                console.log(res)
                //if(res.status === 200)
                //{
                    return res.json()
                //}
            
                //return false

            }) 

            console.log('[ twitch ] rest',{rest});
            
        }
        

            
    }
}