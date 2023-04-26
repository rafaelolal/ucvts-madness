import Link from 'next/link'
import { Button, Spin } from 'antd'
import styled from 'styled-components'
import { useState } from 'react'
import Head from 'next/head'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  align-items: center;
  text-align: center;
`

export default function SignInRequired(props: { message: string }) {
  const [isSignInButtonLoading, setIsSignInButtonLoading] = useState(false)

  return (
    <>
      <Head>
        <title>Sign In Required</title>
      </Head>

      <Container>
        <h1 className='text-center mx-5 mb-4'>{props.message}</h1>

        <Link
          href='/'
          className={`btn btn-primary`}
          onClick={() => setIsSignInButtonLoading(true)}
        >
          {isSignInButtonLoading ? <Spin /> : 'Sign In'}
        </Link>
      </Container>
    </>
  )
}
