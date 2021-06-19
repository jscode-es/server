import Socket from './../../common/socket'
import Scroll from './../../common/smooth_scroll'
import Click from './../../common/click'
import '../../components/charts'

const APP = () =>
{
    
    // Scroll suave
    Scroll.init()

    // Conexión websocket
    new Socket().connection()

    // Escuchar eventos click
    Click.listener()
 
}

$(APP)