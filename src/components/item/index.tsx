import style from './style.module.css'

import Text from '../text'
import Api from '../../class/api'

export default function Item({ text }: any) {


    return (
        <>
            <Text type="h1">{text}</Text>
        </>
    )
}