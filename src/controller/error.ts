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
}