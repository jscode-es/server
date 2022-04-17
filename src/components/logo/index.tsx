import style from './style.module.css'

import Image from 'next/image'

export default function Logo({ children }: any) {
    return (
        <Image className={style.container} src="/img/jscode-logo.png" alt="JSCode" width={60} height={60} />)
}