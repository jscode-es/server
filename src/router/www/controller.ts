import path from 'path'

export default class www
{
	private req:any
	private res:any
	private next:any

	constructor(req:any, res:any, next:any)
	{
	   	this.req  = req
	   	this.res  = res
		this.next = next

		this.launch()
	}

	async launch()
	{
		let data:any 		= null
		let pathService:any = null
		let resource:any 	= null

		// Recover attrs
		let { res, req } = this

		// Request data
		let { method, params, isJsonRequest, query } = req

		// service ej. [ service ] blog, about, .... [ page ] ${service}/programa_con_nodejs
		let { service, page } = params

		if(service)
		{
			pathService = path.resolve(`${__dirname}/${method}/${service}`)
			resource = await(await import(pathService)).default

			// Response JSON
			if(isJsonRequest)
			{
				data = await resource.json()
				return res.json(data)

			// Response HTML
			} else {

				data = await resource.html(page)

				if(data) return res.send(data)
				else res.redirect('/')
			}
		}

		// Pagina principal
		if(!isJsonRequest && service === undefined)
		{
			pathService = path.resolve(`${__dirname}/${method}/index`)
			resource = await(await import(pathService)).default

			data = await resource.html()
			return res.send(data)
		}

		return res.status(404).send('This page not exist')
	}
}