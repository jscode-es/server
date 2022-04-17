import style from './style.module.css'

import Text from '../text'
import Btn from '../btn'

export default function ContentMain({ children }: any) {
    return (
        <div className={style.container}>
            <Text type="h4">No se trata de donde vienes, sino a donde vas</Text>
            <Text type="h1">Desarrollor de software<br></br>de junior a senior</Text>
            <Text type="h5">Todo el contenido desde un solo click</Text>
            <Btn />
        </div>
    )
}