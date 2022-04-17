import style from './style.module.css'

import Image from 'next/image'

export default function Bg() {
    return (
        <>
            <div className={style.container}></div>
            <Image src="/img/bg.gif" alt="JSCode" layout="fill" />
        </>)
}