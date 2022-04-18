import style from './style.module.css'

import Text from '../text'

export default function CopyRight({ children }: any) {
    return (
        <div className={style.container}>
            <Text className="copyRight">JSCode © 2011 - 2022</Text>
            <Text className="copyRight">All rights reserved</Text>
        </div>)
}