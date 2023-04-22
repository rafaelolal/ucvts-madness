import Link from 'next/link'
import { Button } from 'antd'
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
        <h1>{props.message}</h1>

        <Link href='/'>
          <Button
            type='primary'
            loading={isSignInButtonLoading}
            onClick={() => setIsSignInButtonLoading(true)}
          >
            Sign In
          </Button>
        </Link>
      </Container>
    </>
  )
}
