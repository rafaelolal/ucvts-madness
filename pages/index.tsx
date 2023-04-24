import axios from 'axios'
import { Agent } from 'https'
import { useState } from 'react'
import { Card, Input, Button, Form, Space } from 'antd'
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
import Loading from '@/components/loading'

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
              router.replace('/bracket')
            })
            .catch((error) => {
              deleteUser(auth.currentUser as User)
              notify.error({
                message: `user/create/ (${error.code}): ${error.message}`,
                placement: 'bottomRight',
              })
              setIsSubmitting(false)
              throw error
            })
        })
        .catch((error) => {
          notify.error({
            message: `Firebase create user error (${error.code}): ${error.message}`,
            placement: 'bottomRight',
          })
          setIsSubmitting(false)
          throw error
        })
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          router.replace('/bracket')
        })
        .catch((error) => {
          notify.error({
            message: `Sign in error (${error.code}): ${error.message}`,
            placement: 'bottomRight',
          })
          setIsSubmitting(false)
          throw error
        })
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    setIsSubmitting(false)
    throw errorInfo
  }

  if (isLoading) {
    return <Loading />
  }

  if (user !== null) {
    router.replace('/bracket')
    return <Loading />
  }

  return (
    <>
      <Container>
        <Space direction='vertical' style={{ alignItems: 'center' }}>
          <Space>
            <Button
              type='primary'
              disabled={isSigningUp}
              onClick={() => setIsSigningUp(!isSigningUp)}
            >
              Sign Up
            </Button>

            <Button
              type='primary'
              disabled={!isSigningUp}
              onClick={() => setIsSigningUp(!isSigningUp)}
            >
              Sign In
            </Button>
          </Space>

          <Card title={isSigningUp ? 'Signing Up' : 'Signing In'}>
            <p>Welcome to the UCVTS-Madness website!</p>

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
                      message: 'Please confirm your password!',
                    },
                  ]}
                >
                  <Input.Password placeholder='Confirm password' />
                </Form.Item>
              )}

              <Form.Item
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  loading={isSubmitting}
                  onClick={() => setIsSubmitting(true)}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Container>
    </>
  )
}
