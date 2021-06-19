const $ = process.env

import mysql from 'promise-mysql'
import error from './error'
import {helper} from  './helper'
import {ISettingParams} from './interface/i_setting_params'

export default class DataBase
{
    private engine:string = 'mysql'
    private result:any    = []
    private _setting:any   = {}
    
    constructor ( arg:any = {} )
    {   
        this.engine = 'mysql';
        this.result = [];

        this._setting = 
        {
            host:$.IP,
			user: $.DB_USER,
			password:$.DB_PASS,
			database: $.DB_TABLE,
            port: 3306,
            multipleStatements: true,
			connectionLimit: 5000,
			dateStrings: true,
            connectTimeout: 30000,
            //insecureAuth : true
            //debug: true,
            supportBigNumbers:true,
            stringifyObjects:true,
            charset:arg.charset ? arg.charset : 'UTF8_GENERAL_CI',
            queryFormat:function (query:any, values:any) {
                        
                if (!values) return query;
                return query.replace(/\:(\w+)/g, function (txt:any, key:any) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
                }.bind(this));
            }
        }

    }

    // Editar confguración
    setting ( source = {} )
    {   
        this._setting = Object.assign(this._setting, source);
        return this;
    }

    // Establecer conexión
    async connect ()
    {  
        return await mysql.createConnection(this._setting);
    }

    // Punto de acceso a la consulta
    async query ( sql:any, args:any = {})
    {   
        try {
            
            let con  = await this.connect();

            console.log(sql,args);

            let data = await con.query( sql ,args );

            this.result = data;

            con.end();

            return data;

        } catch (error) {

            DataBase.error(error);

            this.result = [];

            return [];
        }

        
    }

    // Manejador de errores
    static error ( err:any, type:any = 'HandlerError' )
	{
        if( err ) 
        {   

            // ===============================
            // ERRORES
            //===============================
            // err.code       = ER_ACCESS_DENIED_ERROR, ECONNREFUSED, PROTOCOL_CONNECTION_LOST, ...
            // err.errno      = Número, contiene el número de error del servidor MySQL.
            // err.fatal      = Booleano, que indica si este error es terminal para el objeto de conexión. Si el error no proviene de una operación de protocolo MySQL, esta propiedad no se definirá.
            // err.sql        = Cadena, contiene el SQL completo de la consulta fallida. Esto puede ser útil cuando se utiliza una interfaz de nivel superior como un ORM que genera las consultas.
            // err.sqlState   = Cadena, contiene el valor SQLSTATE de cinco caracteres.
            // err.sqlMessage = Cadena, contiene la cadena del mensaje que proporciona una descripción textual del error.
            //===============================
            
            // Eliminar proceso lentos
            DataBase.killSlowQuery();

            // Too many connections
            if(err.code=='ER_CON_COUNT_ERROR')
            {
                console.error('***************************');
                console.error('MYSQL ERROR [ ER_CON_COUNT_ERROR ] ' );

            } else {

                console.error('***************************');
                console.error('MYSQL ERROR [ '+type+' ] :', err )
            }

            // Duplicado 
			//if(err.code=='ER_DUP_ENTRY') return false;	
		} 
    }

    // Metodo para validar si no hay datos
    async isEmpty()
    {   
        return (this.result.length == 0);
    }

    async isSuccess()
    {
        return (this.result.affectedRows > 0);
    }

    async getId()
    {
        return this.result.insertId;
    }

    // Preparar consulta
    static prepare (type:any, table:any, attr:any )
    {   
        let sql = `${type}` ;

        if(attr)
        {   
            sql += (attr.values) ? DataBase.values(attr.values) : ((type=='SELECT') ? ' *': '');
            sql += (type=='SELECT' || type=='DELETE') ? ' FROM ' : '';
            sql += `\`${table}\``;
            sql += (attr.set) ? DataBase.setUpdate(attr.set)  : '';
            sql += (attr.where) ? DataBase.where(attr.where)  : '';
            sql += (attr.in)  ? DataBase.in(attr.in, DataBase.isWhereExist(sql))    : '';
            sql += (attr.like)  ? DataBase.like(attr.like, DataBase.isWhereExist(sql))    : '';
            sql += (attr.findSet)  ? DataBase.findSet(attr.findSet, DataBase.isWhereExist(sql))    : '';
            sql += (attr.order) ? DataBase.order(attr.order)  : '';
            sql += (attr.limit) ? DataBase.limit(attr.limit)  : '';
            sql += (attr.insert) ? DataBase.insert(attr.insert) : '';

        } else {

            sql += (type=='SELECT') ? ' * FROM ' : '';
            sql += (type=='DELETE') ? ' FROM ' : '';
            sql += `\`${table}\``;
        }

        return sql;
    }

    // Prepara parametros
    static prepareParams(data:any)
    {
        let _params:any = {};
        let _where  = data.where;
        let _like   = data.like;
        let _insert = data.insert;
        let _set = data.set;
        let _in  = data.in;
        let _call = data.call;

        if(data)
        { 
            if(_where)
            {   

                if(typeof _where === 'object')
                {

                    for (const key in _where) 
                    {   
                        let attr = key.split(':');

                        if(attr.length == 1)
                        {
                            // Array de OR 
                            if(Array.isArray(_where[key]))
                            {   
                                _where[key].forEach((value:any, index:any)=>{
                                    
                                    _params[`w_${key}_${index}`] = value;

                                });

                            } else {
                            
                                _params[`w_${key}`] = _where[key];
                                
                            }

                        } else {


                            attr.forEach((value:any, index:any)=>{
                        
                                _params[`w_${value}_${index}`] = Object.values(_where)[0];

                            });

                            
                        }
                        
                    }
                }
            }

            if(_like)
            {
                
                if(typeof _like === 'object')
                {

                    for (const key in _like) 
                    {   
                        let attr = key.split(':');

                        if(attr.length == 1)
                        {
                            // Array de OR 
                            if(Array.isArray(_like[key]))
                            {   
                                _like[key].forEach((value:any, index:any)=>{
                                    
                                    _params[`l_${key}_${index}`] = value;

                                });

                            } else {
                            
                                _params[`l_${key}`] = _like[key];
                                
                            }
                            
                        } else {

                            attr.forEach((value:any, index:any)=>{
                        
                                _params[`l_${value}_${index}`] = Object.values(_like)[0];

                            });
                        }

                        
                    }
                }
            }

            if(_in)
            {
               
                if(typeof _in === 'object')
                {
                   
                    for (const key in _in) 
                    {   
                        let attr = key.split(':');

                        if(attr.length == 1)
                        {
                            // Array de OR 
                            if(Array.isArray(_in[key]))
                            {   
                                _in[key].forEach((value:any, index:any)=>{
                                    
                                    _params[`in_${key}_${index}`] = value;

                                });

                            } else {
                            
                                _params[`in_${key}`] = _in[key];
                                
                            }
                            
                        } else {

                            
                            attr.forEach((value:any, index:any)=>{
                                
                                _params[`in_${value}_${index}`] = Object.values(_in)[0];

                            });
                        }

                        
                    }
                }
            }

            if(_insert)
            {
                if(typeof _insert === 'object')
                {

                    for (const key in _insert) 
                    {   
                        // Array de OR 
                        if(Array.isArray(_insert[key]))
                        {   
                            _insert[key].forEach((value:any, index:any)=>{
                                
                                _params[`i_${key}_${index}`] = value;

                            });

                        } else {
                           
                            _params[`i_${key}`] = _insert[key];
                            
                        }
                    }
                }
            }

            if(_set)
            {
                
                if(typeof _set === 'object')
                {

                    for (const key in _set) 
                    {   
                        // Array de OR 
                        if(Array.isArray(_set[key]))
                        {   
                            _set[key].forEach((value:any, index:any)=>{
                                
                                _params[`s_${key}_${index}`] = value;

                            });

                        } else {
                           
                            _params[`s_${key}`] = _set[key];
                            
                        }
                    }
                }
            }

            if(_call)
            {
                
                if(typeof _call === 'object')
                {

                    for (const key in _call) 
                    {   
                        // Array de OR 
                        if(Array.isArray(_call[key]))
                        {   
                            _call[key].forEach((value:any, index:any)=>{
                                
                                _params[`c_${key}_${index}`] = value;

                            });

                        } else {
                           
                            _params[`c_${key}`] = _call[key];
                            
                        }
                    }
                }
            }
        }   

       


        return _params;
    }

    // Preparar values
    static values(data:any)
    {   
        let _values = ' ';

        if(Array.isArray(data))
        {
            data.forEach((value, index, array) => {

                let attr = value.split(':');

                if(attr.length==1)
                {
                    _values+= DataBase.isFunctionExist(attr[0]) ? `${attr[0]}, ` : `\`${attr[0]}\`, `;

                } else if (attr.length==2){   

                    _values+= DataBase.isFunctionExist(attr[0]) ? `${attr[0]} AS \`${attr[1]}\`, ` :  `\`${attr[0]}\` AS \`${attr[1]}\`, `;
                }

            });

            _values = _values.slice(0,-2);
        }

        return _values;
    }

    // Preparar where
    static where(data:any)
    {
        let _where = '';

        if(typeof data === 'object')
        {
            _where = ' WHERE ';

            for (let key in data) 
            {   
                let attr = key.split(':');                
                let val = data[key];

                let compareSymbol = "=";
                switch (key.slice(-2)) {
                    case "<<":                        
                    case ">>": 
                        delete data[key];
                        compareSymbol = key.slice(-1);
                        key = key.substr(0,key.length-2)
                        data[key] = val;  
                        break;                    
                    case "<=":                       
                    case ">=":
                        delete data[key];
                        compareSymbol = key.slice(-2);
                        key = key.substr(0,key.length-2);
                        data[key] = val;
                        break;
                    case "!=":
                    case "<>":
                        delete data[key];
                        compareSymbol = key.slice(-2);
                        key = key.substr(0,key.length-2);
                        data[key] = val;
                        break;

                }
                 
                if(attr.length == 1)
                {   
                    // Array de OR 
                    if(Array.isArray(data[key]))
                    {   

                        if(_where.length != 7) _where += ' AND ';

                        _where += '( ';

                        data[key].forEach((value:any, index:any)=>{

                            if(value==null)
                            {
                                _where += `\`${key}\` is null OR `
                            } else {
                                _where += `\`${key}\` ${compareSymbol} :w_${key}_${index} OR `
                            }


                        });

                        _where = _where.slice(0,-3);
                        _where += ') ';
                    

                    } else {

                        if(_where.length != 7) _where += ` AND `;

                        if(data[key]==null)
                        {
                            _where += `\`${key}\` is null`;   

                        } else {
                            _where += `\`${key}\` ${compareSymbol} :w_${key}`;   
                        }

                    }

                } else {

                    _where += '( ';

                    attr.forEach((value, index)=>{
                
                        _where += `\`${value}\` ${compareSymbol} :w_${value}_${index} OR `

                    });

                    _where = _where.slice(0,-3);
                    _where += ') ';
                }

                
            }
            
        }
        
        return _where;
    }

    // Preparar like
    static like(data:any, _isWhereExist:any = false )
    {
        let _like = '';

        if(!_isWhereExist) _like = ' WHERE ';

        if(typeof data === 'object')
        {
            for (const key in data) 
            {   
                let attr = key.split(':');

                if(attr.length == 1)
                {
                    // Array de OR 
                    if(Array.isArray(data[key]))
                    {   

                        if(_like != ' WHERE ' ) _like += ' AND ';

                        _like += '( ';

                        data[key].forEach((value:any, index:any)=>{
                
                            _like += `\`${key}\` LIKE :l_${key}_${index} OR `

                        });

                        _like = _like.slice(0,-3);
                        _like += ') ';
                    

                    } else {
                        
                        if( _like != ' WHERE ' ) _like += ' AND ';
                        //if(_like.length != 0 || _like != ' WHERE ' ) _like += ' AND ';

                        _like += `\`${key}\` LIKE :l_${key}`;
                        
                    }

                } else {

                    if(_like != ' WHERE ' ) _like += ' AND ';

                    _like += '( ';

                    attr.forEach((value, index)=>{
                
                        _like += `\`${value}\` LIKE :l_${value}_${index} OR `

                    });

                    _like = _like.slice(0,-3);
                    _like += ') ';
                }  
            }
        }

        return _like;

    }

    // Preparar in
    static in(data:any, _isWhereExist:any = false )
    {
        let _in = '';

        if(!_isWhereExist) _in = ' WHERE ';

        if(typeof data === 'object')
        {
            for (const key in data) 
            {   
                let attr = key.split(':');

                if(attr.length == 1)
                {
                    // Array de OR 
                    if(Array.isArray(data[key]))
                    {   
                        if(_in != ' WHERE ' ) _in += ' AND ';

                        _in += ` \`${key}\` IN( `;

                        data[key].forEach((value:any, index:any)=>{
                
                            _in += ` :in_${key}_${index} , `

                        });

                        _in = _in.slice(0,-3);
                        _in += ') ';
                    

                    } else {
                        
                        if( _in != ' WHERE ' ) _in += ' AND ';
                        _in += `\`${key}\` IN( :in_${key} )`;
                        
                    }

                } else {

                    if(_in != ' WHERE ' ) _in += ' AND ';

                    _in += '( ';

                    attr.forEach((value, index)=>{
                
                        _in += `\`${value}\` IN ( :in_${value}_${index} ) `
                    });

                    _in = _in.slice(0,-3);
                    _in += ') ';
                }

                
            }
            
        }

        return _in;

    }

    // Preparar FIND_IN_SET
    static findSet(data:any, _isWhereExist:any = false )
    {
        let _in = '';

        if(!_isWhereExist) _in = ' WHERE ';

        if(typeof data === 'object')
        {
            for (const key in data) 
            {   
                let attr = key.split(':');

                if(attr.length == 1)
                {
                    // Array de OR 
                    if(Array.isArray(data[key]))
                    {   
                        if(_in != ' WHERE ' ) _in += ' AND ';

                        _in += '( ';

                        
                        data[key].forEach((value:any)=>{
                            
                            _in += `FIND_IN_SET(\'${value}\', \`${key}\` ) != 0 OR `

                        });

                        _in = _in.slice(0,-3);
                        _in += ') ';
                    

                    } else {

                        if( _in != ' WHERE ' ) _in += ' AND ';
                        let a = data[key]
                        _in += `FIND_IN_SET (\'${data[key]}\',\`${key}\` ) != 0 `;
                        
                    }

                } else {

                    if(_in != ' WHERE ' ) _in += ' AND ';

                    _in += '( ';

                    attr.forEach((value, index)=>{
                
                        _in += `FIND_IN_SET(\'${value}\', \`${key}\` ) != 0 OR `

                    });

                    _in = _in.slice(0,-3);
                    _in += ') ';
                }

                
            }
            
        }

        return _in;

    }

    // Preparar order
    static order(data:any)
    {   
        let _order = '';

        if(typeof data === 'object' && Object.keys(data).length > 0)
        {
            _order = ' ORDER BY '

            for (const key in data) 
            {
                _order+=`\`${key}\` ${data[key].toUpperCase()}, `
            }

            _order = _order.slice(0,-2);
            
        }

        return _order;
    }
    
    // Preparar limit
    static limit(data:any)
    {   
        let _limit = '';

        if(typeof data === 'string')
        {   
            _limit = ` LIMIT ${data}`;

        } else {
            
            _limit = ` LIMIT ${String(data)}`;
        }

        return _limit
    }

    // Preparar insert
    static insert(data:any)
    {   
        let attr = '';
        let values = '';
         
        for (const key in data) 
        {
           attr+= "`"+key+"`,";
           values+= ":i_"+key+","
        }

        attr = attr.slice(0,-1);
        values = values.slice(0,-1);

        return `(${attr}) VALUES (${values})`;
      
    }

    // Preparar setUpdate
    static setUpdate(data:any)
    {   
        let set = '';
        let values = '';
         
        for (const key in data) 
        {
            values+= "`"+key+"` = :s_"+key+","
        }

        values = values.slice(0,-1);

        return ` SET ${values}`;
    
    }
    
    // Preparar Objeto JSON de procedure
    static callParams(data:any)
    {
        let values = "'{";

        for (const key in data) {

            if (data[key] == null)
                values += `"${key}": "NULL",`;
            else
                values += `"${key}": ${typeof data[key] == 'string'? `"${data[key].replace(/'/g,"\\'")}"` : data[key]},`;
        }
        values = values.slice(0,-1);

        values+="}'";

        return values;
    }

    // Detectar where
    static isWhereExist(data:any)
    {
        const regex = /WHERE/gm;

        return regex.test(data);
    }

    // Detectar where
    static isFunctionExist(data:any)
    {
        const regex = /\(/gm;

        return regex.test(data);
    }
    
    // Buscar en toda la tabla
    async findAll ( table:any, attr:any = {} )
    {
        let result = [];

        if(table) 
        {    
            
            let sql     = DataBase.prepare('SELECT', table, attr);
            let params  = DataBase.prepareParams(attr);

            result = await this.query(sql, params);

            
            
        }
        
        return result;
    }

    // Añadir registro
    async add ( table:any, attr:any)
    {
        let result = [];

        if(table && attr) 
        { 
            let sql     = DataBase.prepare('INSERT INTO ', table, {insert:attr});
            let params  = DataBase.prepareParams({insert:attr});

            //console.time('QUERY');
            result = await this.query(sql, params);
            //console.timeEnd('QUERY');

            
        }

        return result;
    }

    // Eliminar registro
    async remove ( table:any, attr:any)
    {
        let result = [];

        if(table && attr) 
        { 
            let sql     = DataBase.prepare('DELETE FROM ', table, attr );
            let params  = DataBase.prepareParams(attr);

            result = await this.query(sql, params);

            if($.showLogDelete == 'true')
            {
                console.log('PARAMS: ', params );
                console.log('RESULT: ', result );
            }
        }

        return result;
    }

    // Actualizar registro
    async update ( table:any, attr:any)
    {
        let result = [];

        if(table && attr) 
        { 
            let sql     = DataBase.prepare('UPDATE ', table, attr );
            let params  = DataBase.prepareParams(attr);

            result = await this.query(sql, params);

            if($.showLogUpdate == 'true')
            {
                console.log('PARAMS: ', params );
                console.log('RESULT: ', result );
            }
        }

        return result;
    }

    // Preparar SQL de llamada a Stored Procedure
    static prepareCall (type:any, process:any, attr:any )
    {
        let sql = `${type} ${process} (` ;

        if(attr)
        {  
            sql += DataBase.callParams(attr);
        } 

        sql += ')';

        return sql;
    }

    async prepareCallParams(data:any)
    {
        for (const key in data) {
            if (typeof data[key] == 'string')
            {
                data[key] = data[key].replace(/'/g,"\\'");
            }
        }
        return data;
    }

    // Llamar a los processo almacenados
    async call( process:any, attr:any )
    {
        /*let result = [];

        if(process)
        {
           
            attr = JSON.stringify(attr);
            // attr = attr.replace(/'/g,"\\'");
            
            // let params = this.prepareCallParams(attr);
            // params = JSON.stringify(params);
            // let sql = DataBase.prepareCall("CALL", process, attr);            
            let sql = `CALL ${process} ('${attr}')`;
            result = await this.query(sql);


            /*  --------------

                Return db.call( [method], [json] )

                return 
                [
                    [ { id: number } ],
                    {
                        fieldCount: 0,
                        affectedRows: 0,
                        insertId: 0,
                        serverStatus: 2,
                        warningCount: 0,
                        message: '',
                        protocol41: true,
                        changedRows: 0
                    }
                ]

                --------------*/
        /*}

        return result;*/
    }

    static async killSlowQuery()
    {
        /*let sql = 'show full processlist';
        let db  = new DataBase();

        let data = await db.query(sql);

        for (const queries of data) 
        {  
            if(queries.Time >= 150)
            {
                if(queries.Command == 'Sleep' || queries.Command == 'Query')
                {
                    db.query(`KILL ${queries.Id}`);
                }
                
            }
        }*/
    }

}