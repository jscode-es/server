import Modal from './modal'

export default class Click
{
    static listener()
    {
        $(document).on('click','.click', function(event){

            event.preventDefault()

            let method = $(this).attr('e-method')

            if(typeof Click[method] === 'function')
            {
                return Click[method]($(this),event)
            }

            console.warn(`Este método no existe "${method}"`)
        })
    }

    // Cerrar panel
    private static close()
    {
        $('#panel').removeClass('animation')
    }

    // Abrir panel
    private static demo()
    {
        $('#panel').addClass('animation')
    }

    // Abrir pagina
    private static async content(self)
    {
        self.parents('ul').find('.active').removeClass('active')
        self.addClass('active')
    }

    // Abrir login
    private static async login() 
    {
        Modal.get('login')
    }

    // Abrir register
    private static async register() 
    {
        Modal.get('register')
    }
}