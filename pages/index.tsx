import type { NextPage } from 'next'
import Head from 'next/head'
import Container from '../src/components/container'
import ContainerCenter from '../src/components/container-center'
import Main from '../src/components/main'
import Text from '../src/components/text'
import CopyRight from '../src/components/copy-right'
import ContentMain from '../src/components/content-main'
import Logo from '../src/components/logo'
import Bg from '../src/components/bg'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>JSCode | Junior & Senior Code</title>
        <meta name="description" content="Junior & Senior Code" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Container>
          <Bg />
          <ContainerCenter>
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
