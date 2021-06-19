const $ = process.env

import { date } from "joi"
//const Api =  require('youtube-api')
import fetch from "node-fetch"



export default class Youtube
{
    static readonly URL     = 'https://youtube.googleapis.com/youtube/v3/'
    static readonly CHANNEL = 'UCXLcSZzqpRzQ-FplONzCrMw'

    static test()
    {
        console.log('[ Youtube ] Test ... ')

        let method:string = 'search'

        if(Youtube.isExistMethod(method))
        {
            //Youtube.getVideo()
            return 
        }
        
        console.log(`This method "${method}", no exist`)
    }

    static isExistMethod(name:any)
    {
        return (name in Youtube)
    }

    static getMethod(name:string, ...params:any)
    {

    }

    static async getVideos(setting:any = {})
    {
        console.log('[ Youtube ] getVideos ... ')

        let _default:any = 
        {
            part:'snippet',
            channelId:Youtube.CHANNEL,
            key:$.YOUTUBE_KEY,
            maxResults:1,
            order: "date"
        }

        Object.assign(_default, setting)

        var params = new URLSearchParams(_default).toString();

        let result = await fetch(`${Youtube.URL}search?${params}`,{} ).then(res => res.json());

        if(result.error)
        {
            return 
        }
        console.log(result)

        let list:any = []

        for (const item of result.items) 
        {   
            let data = 
            {
                thumbnails:item.snippet.thumbnails.high.url,
                url:`https://www.youtube.com/watch?v=${item.id.videoId}`,
                title:item.snippet.title,
                description:item.snippet.description
            }

            list.push(data)
            
        }

        return list
    }

    static async getPlaylist(setting:any = {})
    {
        console.log('[ Youtube ] getPlaylist ... ')

        let _default:any = 
        {
            part:'snippet',
            channelId:Youtube.CHANNEL,
            key:$.YOUTUBE_KEY,
            maxResults:3,
            order: "date"
        }

        Object.assign(_default, setting)

        var params = new URLSearchParams(_default).toString();

        let result = await fetch(`${Youtube.URL}playlists?${params}`,{} ).then(res => res.json());

        if(result.error)
        {
            return 
        }
        console.log(result)

        let list:any = []

        for (const item of result.items) 
        {   
            let data = 
            {
                thumbnails:item.snippet.thumbnails.high.url,
                url:`https://www.youtube.com/playlist?list=${item.id}`,
                title:item.snippet.title,
                description:item.snippet.description
            }

            list.push(data)
            
        }

        return list
    }
}   


