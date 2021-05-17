export default class error
{
    static listener()
    {
        process.on('unhandledRejection', error.unhandledRejection )
        process.on('uncaughtException', error.uncaughtException )
        process.on('multipleResolves', error.multipleResolves )
    }

    private static unhandledRejection( reason:any, promise:any)
    { 
        console.dir(promise)

        console.log(`[ unhandledRejection ] ${promise}, reason: ${reason}`)
    }

    private static uncaughtException(error:any)
    {
        console.log(`[ uncaughtException ] ${error}`)
    }

    private static multipleResolves(type:any, promise:any, reason:any)
    {
        console.log(`[ multipleResolves ] ${type} - ${promise}, reason: ${reason}`)
    }

    static database(error:any, ...args:any)
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

        if(error)
        {
            console.log('***************************')
            console.log('[ DATABASE ] ERROR:'+error)
        }
    }
}