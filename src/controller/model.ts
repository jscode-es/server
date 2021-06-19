import path from "path"

export default async (name:any) =>
{
    let dir = path.resolve(`${__dirname}/../model/${name.trim().toLowerCase()}`)
    
    return (await import(dir)).default;
}