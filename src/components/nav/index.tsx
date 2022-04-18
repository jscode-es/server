import style from './style.module.css'

import { FaBars } from "react-icons/fa"

export default function Nav({ showMenu, setShowMenu }: any) {

    const handlerClick = () => {

        setShowMenu(!showMenu)
    }

    return (
        <FaBars className={style.container} onClick={handlerClick} />
    )
}