import style from './style.module.css'

import Text from '../text'

export default function Alink() {

    return (
        <a href='https://www.npmjs.com/package/object_mysql' className={style.container} target="_blank" rel="noreferrer">
            <Text>Ver modulo</Text>
        </a>
    )
}