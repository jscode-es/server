import style from './style.module.css'

export default function Text({ children, type, className }: any) {

    const CustomTag = type || 'span'

    const nameClass = className || style.text

    return <CustomTag className={nameClass}>{children}</CustomTag>
}