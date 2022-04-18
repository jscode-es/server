/* eslint-disable @next/next/no-img-element */
import style from './style.module.css'

//import Image from 'next/image'

export default function Bg() {
    return (
        <>
            <div className={style.container}></div>
            <img className={style.img} src="/img/bg.gif" alt="JSCode" />
        </>)
}