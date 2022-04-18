import style from './style.module.css'

import Nav from '../nav'
import Margin from '../margin'
import Text from '../text'
import Alink from '../alink'
import Image from 'next/image'
import Item from '../item'

export default function Menu({ showMenu, setShowMenu }: any) {

    let classContainer = showMenu ? `${style.container} ${style.show}` : `${style.container}`

    return (
        <div className={classContainer}>
            <div className={style.col1}>
                <div>
                    <Margin>
                        <Text type="h2">Menu</Text>
                        <Text type="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras fringilla ligula maximus eros eleifend porttitor. Suspendisse a libero hendrerit, pharetra dui quis, mattis odio. Morbi imperdiet ultricies purus id pharetra. Nunc a dolor a eros egestas ultricies. Proin egestas purus vitae mi sollicitudin volutpat. In ut hendrerit mi. Quisque efficitur tellus dolor, ac dignissim diam hendrerit in. Mauris ut porttitor libero.</Text>
                        <Text>Proyectos</Text>
                        <Item text="Modulo: object_mysql" />
                        <Item text="Speack.me" />
                    </Margin>
                </div>
            </div>
            <div className={style.col2}>
                <div>
                    <Margin>
                        <Nav showMenu={showMenu} setShowMenu={setShowMenu} />
                        <div className={style.title}>
                            <div>
                                <Image src="/img/{mysql}.png" alt="Object Mysql" width={160} height={160} />
                            </div>
                            <div>
                                <Text type="h2">Modulo: object_mysql</Text>
                                <Text type="h3">Conversión de base de datos mysql en un objecto javascript/typescript</Text>
                            </div>
                        </div>

                        <Text type="p">Object_mysql es un ORM de Node.js basado en promesas para MySQL, sin necesidad de definir un modelo previo de la estructura de las tablas definida en el motor de BBDD como se realiza en Sequelize.</Text>
                        <Text type="p">Dispone de un administrado de validación de atributos, tanto si esta definido en la base de datos como la tipologia del propio dato dato; detectando mediante el nombre del atributo si es por ejemplo un corre electrónico.</Text>
                        <Alink />
                    </Margin>
                </div>
            </div>
        </div>
    )
}