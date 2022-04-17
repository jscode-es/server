import style from './style.module.css'

export default function ContainerCenter({ children }: any) {
    return (<div className={style.container}>{children}</div>)
}