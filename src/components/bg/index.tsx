/* eslint-disable @next/next/no-img-element */
import style from './style.module.css'

/* import Image from 'next/image'
import bg from '../../../public/img/bg.gif' */

export default function Bg() {
    return (
        <>
            <div className={style.container}></div>
            {/* <Image className={style.img} src={bg} alt="JSCode" layout="fill" /> */}
        </>)
}