import Head from 'next/head'
import axios from 'axios'
import { Agent } from 'https'
import { useState } from 'react'
import { Card, Input, Button, Form, Space, Typography } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { useAppContext } from '@/context/state'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
  User,
} from 'firebase/auth'
import { auth } from '../firebaseConfig'

const httpsAgent = new Agent({
  rejectUnauthorized: false,
})

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`

export default function IndexPage() {
  const { user, isLoading, notify } = useAppContext()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(true)

  const onFinish = (values: {
    email: string
    password: string
    confirmPassword: string
  }) => {
    setIsSubmitting(true)
    if (isSigningUp) {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user
          axios
            .post('http://127.0.0.1:8000/api/user/create/', {
              id: user.uid,
              email: user.email,
            })
            .then(() => {
              notify.success('Account created successfully')
              router.replace('/bracket')
            })
            .catch((error) => {
              deleteUser(auth.currentUser as User)
              notify.error(`user/create/ (${error.code}): ${error.message}`)
              setIsSubmitting(false)
              throw error
            })
        })
        .catch((error) => {
          notify.error(
            `"Firebase create user error (${error.code}): ${error.message}`
          )
          setIsSubmitting(false)
          throw error
        })
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          router.replace('/bracket')
        })
        .catch((error) => {
          notify.error(`Sign in error (${error.code}): ${error.message}`)
          setIsSubmitting(false)
          throw error
        })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log({ signInFinishError: errorInfo })
  }

  if (isLoading) {
    return <Typography.Title>Loading...</Typography.Title>
  }

  if (user) {
    router.replace('/bracket')
  }

  return (
    <>
      <Head>
        <title>UCVTS MADNESS</title>
      </Head>

      <Container>
        <Card title={isSigningUp ? 'Signing Up' : 'Signing In'}>
          <Typography.Text>
            Welcome to the UCVTS-Madness website
          </Typography.Text>

          <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your school issued email!',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder='@ucvts.org' />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder='Password' />
            </Form.Item>

            {isSigningUp && (
              <Form.Item
                name='confirmPassword'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password again!',
                  },
                ]}
              >
                <Input.Password placeholder='Confirm password' />
              </Form.Item>
            )}

            <Space>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={isSubmitting}
                  onClick={() => setIsSubmitting(true)}
                >
                  Submit
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type='primary'
                  onClick={() => setIsSigningUp(!isSigningUp)}
                >
                  {isSigningUp ? 'Sign In Instead' : 'Sign Up Instead'}
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </Container>
    </>
  )
}