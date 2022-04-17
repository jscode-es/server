import style from './style.module.css'

import Text from '../text';

export default function Btn() {


    return (
        <a className={style.container} href="https://www.twitch.tv/jscode_/videos?filter=archives&sort=time">
            <Text>Ver diferido</Text>
        </a>
    )
}