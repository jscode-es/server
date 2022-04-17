import style from './style.module.css'

export default function Main({ children }: any) {
    return <div className={style.container}>{children}</div>
}