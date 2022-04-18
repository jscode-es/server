import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Container from '../src/components/container'
import ContainerCenter from '../src/components/container-center'
import Main from '../src/components/main'
import Text from '../src/components/text'
import CopyRight from '../src/components/copy-right'
import ContentMain from '../src/components/content-main'
import Logo from '../src/components/logo'
import Bg from '../src/components/bg'
import Nav from '../src/components/nav'
import Menu from '../src/components/menu'

const Home: NextPage = () => {

  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <Head>
        <title>JSCode | Junior & Senior Code</title>
        <meta name="description" content="Junior & Senior Code" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {/* <Menu showMenu={showMenu} setShowMenu={setShowMenu} /> */}
        <Container>
          <Bg />
          <ContainerCenter>
            {/* <Nav showMenu={showMenu} setShowMenu={setShowMenu} /> */}
            <Logo />
            <ContentMain />
            <CopyRight />
          </ContainerCenter>
        </Container>
        {/* <div><h3>holas</h3></div> */}
      </Main>
    </>
  )
}

export default Home
