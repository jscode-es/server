import style from './style.module.css'

export default function Margin({ children }: any) {

    return (
        <div className={style.container}>{children}</div>
    )
}