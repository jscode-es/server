import style from './style.module.css'

export default function Text({ children, type, className }: any) {

    const CustomTag = type || 'span'

    const nameClass = className || style[type] || style.span

    return <CustomTag className={nameClass}>{children}</CustomTag>
}