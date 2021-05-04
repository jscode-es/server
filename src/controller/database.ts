const $ = process.env

import mysql from 'promise-mysql'
import error from './error'
import {helper} from  './helper'
import {ISettingParams} from './interface/i_setting_params'

export default class database
{
    private engine:string = 'mysql'
    private result:any    = []
    private setting:any   = {}

    private static readonly INSERT:string = 'INSERT INTO'
    private static readonly SELECT:string = 'SELECT'
    private static readonly DELETE:string = 'DELETE'
    private static readonly REMOVE:string = 'DELETE FROM ' 
    private static readonly UPDATE:string = 'UPDATE '

    constructor(params:any = {}) 
    {
        this.setSetting(params)
    }

    private setSetting(params:any)
    {
        let setting =
        {
            host: $.IP ,
            user: $.DB_USER ,
            password: $.DB_PASS,
            database: $.DB_TABLE,
            port:3306,
            multipleStatements:true,
            connectionLimit:5000,
            dateStrings:true,
            connectionTimeout:30000,
            supportBigNumbers:true,
            stringifyObject:true,
            charset: $.DB_CHARSET,
            queryFormat: function(query:any, values:any)
            {
                if(!values) return query

                return query.replace(/\:(\w+)/g, function(txt:any, key:any){

                    if(values.hasOwnProperty(key))
                    {
                        return this.escape(values[key])
                    }

                    return txt

                }).bind(this)
            }
        }

        Object.assign(setting, params)

        this.setting = setting
    }

    // Connection
    private async connection() 
    {
        return await mysql.createConnection(this.getSetting())
    }

    private static prepareSQL(type:string, table:string, attrs:ISettingParams):any
    {
        let sql = type
        let { values, set, where, like, findset, order, limit, insert } = attrs

        if(attrs)
        {
            sql += (values) ? database.values(values) : ((type===database.SELECT)) ? '*' : ''
            sql += (type === database.SELECT || type === database.DELETE ) ? ' FROM' : ''
            sql += `\`${table}\``
            sql += (set) ? database.setUpdate(set) : ''
            sql += (where) ? database.where(where) : ''
            sql += (like) ? database.like(like, database.isWhereExist(sql)) :''
            sql += (findset) ?  database.findSet(findset, database.isWhereExist(sql)) : ''
            sql += (order) ? database.order(order) : ''
            sql += (limit) ? database.limit(limit)  : '';
            sql += (insert) ? database.insert(insert) : ''
        
        } else {

            sql += ( type === database.SELECT) ? ' * FROM ' : ''
            sql += ( type === database.DELETE) ? ' FROM ' : ''
            sql += `\`${table}\``
        }

        return sql
    }

    private static prepareParams(attrs:object):any
    {
        return ''
    }

    private static values(data:any):string
    {
        let values:string = ' ';

        if(Array.isArray(data))
        {

            data.forEach((value)=>{

                let attr = value.split(':')

                if(attr.length === 1)
                {

                    values += database.isFunExist(attr[0]) ? `${attr[0]}, ` : `\`${attr[0]}\`, ` // SELECT ${#}

                } else if (attr.length === 2) {

                    values += database.isFunExist(attr[0]) ? `${attr[0]} AS \`${attr[1]}\`, ` : `\`${attr[0]}\` AS \`${attr[1]}\`, ` 
                }

            })

            values = values.slice(0,-2)

        }


        return values
    }
    
    private static where(data:any):string
    {
        let where = ''

        if( typeof data === 'object')
        {
            where += ' WHERER '

            for (const key in data)
            {
                let attrs = key.split(':')

                if(attrs.length === 1)
                {

                    if(Array.isArray(data[key]))
                    {

                        // check size where
                        if(where.length != 7 ) where += ' AND '

                        where += '( '

                        data[key].array.forEach((value:any,index:any) => {
                            
                            if(value === null)
                            {
                                where += `\`${key}\` is nul OR `
                            } else {
                                where += `\`${key}\` =  :w_${key}_${index} OR `
                            }
                        })

                        where = where.slice(0, -3)
                        where = ') '

                    } else {

                        if(where.length != 7) where += ` AND `;

                        if(data[key]==null)
                        {
                            where += `\`${key}\` is null`;   

                        } else {
                            where += `\`${key}\` = :w_${key}`;   
                        }
                    }


                } else {

                    where += '( ';

                    attrs.forEach((value, index)=>{
                
                        where += `\`${value}\` = :w_${value}_${index} OR `

                    });

                    where = where.slice(0,-3);
                    where += ') ';
                }
            }
        }

        return where 
    }

    private static setUpdate(data:any):string
    {
        let values = '';
         
        for (const key in data) 
        {
            values+= "`"+key+"` = :s_"+key+","
        }

        values = values.slice(0,-1);

        return ` SET ${values}`;
    }

    private static like(data:any, isWhereExist = false ):string
    {
        let like = ''

        if(!isWhereExist) like = ' WHERE '

        if(typeof data === 'object')
        {
            for (const key in data) 
            {   
                let attr = key.split(':')

                if(attr.length == 1)
                {
                    // Array de OR 
                    if(Array.isArray(data[key]))
                    {   

                        if(like != ' WHERE ' ) like += ' AND ';

                        like += '( '

                        data[key].forEach((value:any, index:any)=>{
                
                            like += `\`${key}\` LIKE :l_${key}_${index} OR `

                        });

                        like = like.slice(0,-3)
                        like += ') '
                    

                    } else {
                        
                        if( like != ' WHERE ' ) like += ' AND '

                        like += `\`${key}\` LIKE :l_${key}`
                        
                    }

                } else {

                    if(like != ' WHERE ' ) like += ' AND '

                    like += '( ';

                    attr.forEach((value, index)=>{
                
                        like += `\`${value}\` LIKE :l_${value}_${index} OR `

                    });

                    like = like.slice(0,-3)
                    like += ') '
                }

                
            }
            
        }

        return like;
    }

    private static findSet(data:any, isWhereExist = false ):string
    {
        let _in = '';

        if(!isWhereExist) _in = ' WHERE ';

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

                        _in += `FIND_IN_SET (\`${key}\`, :in_${key} ) != 0 `;
                        
                    }

                } else {

                    if(_in != ' WHERE ' ) _in += ' AND ';

                    _in += '( ';

                    attr.forEach((value)=>{
                
                        _in += `FIND_IN_SET(\'${value}\', \`${key}\` ) != 0 OR `

                    });

                    _in = _in.slice(0,-3);
                    _in += ') ';
                }

                
            }
            
        }

        return _in;

    }

    private static order(data:any):string
    {
        let order = '';

        if(typeof data === 'object' && Object.keys(data).length > 0)
        {
            order = ' ORDER BY '

            for (const key in data) 
            {
                order+=`\`${key}\` ${data[key].toUpperCase()}, `
            }

            order = order.slice(0,-2);
            
        }

        return order;      
    }

    private static insert(data:any):string
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

    private static limit(data:any):string
    {   
        let limit = '';

        if(typeof data === 'string')
        {   
            limit = ` LIMIT ${data}`;

        } else {
            
            limit = ` LIMIT ${String(data)}`;
        }

        return limit
    }

    private static callParams(data:any):string
    {
        let values = "'{";

        for (const key in data) {
            // console.log("DATA KEY", data[key]);
            if (data[key] == null)
                values += `"${key}": "NULL",`;
            else
                values += `"${key}": ${typeof data[key] == 'string'? `"${data[key].replace(/'/g,"\\'")}"` : data[key]},`;
        }
        values = values.slice(0,-1);

        values+="}'";

        return values;
    }

    private static isWhereExist(data:any):boolean
    {
        return false
    }

    private static isFunExist(data:any):boolean
    {
        const expression = /\(/gm

        return expression.test(data)
    }

    getSetting():any
    {
        return this.setting
    }

    // Query
    async query( sql:string, attrs = {})
    {
        try {

            let con  = await this.connection()
            let data = await con.query(sql, attrs)

            this.result = data
            
            con.end()

            return data
            
        } catch (error) {

            error.database(error)

            return this.result
            
        }
    }

    // Return values 
    isEmpty()
    {
        return this.result.length === 0
    }

    isSuccess()
    {
        return this.result.affectedRows > 0
    }

    getId()
    {
        return this.result.insertId
    }

    // Method insert
    async add(table:string, attrs: object)
    {
        if(helper.isString(table) && !helper.isStringEmpty(table) && attrs)
        {
            let sql     = database.prepareSQL(database.INSERT, table, {insert:attrs})
            let params  = database.prepareParams({insert:attrs})

            this.result = await this.query(sql, params)
        }

        return this.result

    }

    // Method read
    async findAll(table:string, attrs: object)
    {
        if(helper.isString(table) && !helper.isStringEmpty(table) && attrs)
        {
            let sql     = database.prepareSQL(database.SELECT, table, {insert:attrs})
            let params  = database.prepareParams({insert:attrs})

            this.result = await this.query(sql, params)
        }

        return this.result
    }

    // Method update
    async update(table:string, attrs: object)
    {
        if(helper.isString(table) && !helper.isStringEmpty(table) && attrs)
        {
            let sql     = database.prepareSQL(database.UPDATE, table, {insert:attrs})
            let params  = database.prepareParams({insert:attrs})

            this.result = await this.query(sql, params)
        }

        return this.result
    }

    // Method delete
    async remove(table:string, attrs: object)
    {
        if(helper.isString(table) && !helper.isStringEmpty(table) && attrs)
        {
            let sql     = database.prepareSQL(database.REMOVE, table, {insert:attrs})
            let params  = database.prepareParams({insert:attrs})

            this.result = await this.query(sql, params)
        }

        return this.result
    }

    async call( process:string, attr:any )
    {
        let result = [];

        if(process)
        {
            attr = JSON.stringify(attr);        
            let sql = `CALL ${process} ('${attr}')`;
            result = await this.query(sql);

        }

        return result;
    }


    static async killSlowQuery()
    {
        let sql = 'show full processlist';
        let db  = new database();

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
        }
    }

    static async backup()
    {
        /*console.log('[ Database ] Iniciar copia de seguridad');
        
        const path           = require('path');
        const { v4: uuidv4 } = require('uuid');
        const mysqldump      = require('mysqldump');
        const dumpFileName   = `${uuidv4()}.dump.sql.gz`;

        mysqldump({
            connection: {
                host: '82.223.10.139',
                user: $.db_User,
                password: $.db_Pass,
                database: $.db_Table,
            },
            dumpToFile: path.resolve(`${$.backup}/${dumpFileName}`),
            compressFile: true
        });*/
    }

}