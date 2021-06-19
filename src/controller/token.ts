import jwt from "jsonwebtoken"

const $   = process.env;

export default class token 
{
    static async get(data:any)
	{	
		try { 

            return jwt.verify( data, $.JWT_SECRET||"" );

        } catch (error) { 

            console.log('[ ERROR ]',error)
            return false; 
        }
		
	}

	static async set(data={}, setting={})
	{
        // INFO: Se pude poner un tiempo de expiración al token
        let options =
        {
            //expiresIn: '1h',
        }

        Object.assign(options,setting);

		return jwt.sign( data, $.JWT_SECRET||"", options );
	}
}
