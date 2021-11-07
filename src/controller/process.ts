class Process {

    static listen() {

        process.on('SIGINT', Process.sigint)
    }

    static sigint() {
        console.log('Procesos SIGINT ==============')
    }
}

export default Process