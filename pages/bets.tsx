import Navbar from '@/components/navbar'
import { useAppContext } from '@/context/state'
import { getGameList, getTeamList } from '@/sheets'
import { Button, Form, Modal, Select, Space, Spin, Typography } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { isLabeledStatement } from 'typescript'
import useSWR from 'swr'
import Timer from '@/components/timer'

export default function BetsPage(props: {
  teams: string[][]
  games: string[][]
}) {
  const { user, isLoading, notify } = useAppContext()
  const router = useRouter()

  const [canMakeBets, setCanMakeBets] = useState(true)
  const [betData, setBetData] = useState(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBetsSubmitButtonLoading, setIsBetsSubmitButtonLoading] =
    useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!user) {
      return
    }

    axios
      .get(`http://127.0.0.1:8000/api/user/${user.uid}/bet/`)
      .then((response) => setBetData(response.data))
      .catch((error) => {
        if (error.response.status == 404) {
          setBetData(null)
          return
        }

        notify.error({
          message: `user/bet/ (${error}): ${error.message}`,
          position: 'bottomRight',
        })

        throw error
      })
  }, [user])

  const onFinish = async () => {
    try {
      const values = await form.validateFields()

      axios
        .post('http://127.0.0.1:8000/api/bet/create/', {
          user: user.uid,
          order: Object.values(values).join('*'),
        })
        .then(() => {
          notify.success({
            message: 'Bets placed successfully!',
            position: 'bottomRight',
          })
          setBetData(Object.values(values).join('*'))
          setIsBetsSubmitButtonLoading(false)
          setIsModalOpen(false)
        })
        .catch((error) => {
          notify.error({
            message: `bet/create/ (${error.code}): ${error.message}`,
            placement: 'bottomRight',
          })
          setIsBetsSubmitButtonLoading(false)
          throw error
        })
    } catch (error) {
      setIsBetsSubmitButtonLoading(false)
      throw error
    }
  }

  const ordinalOf = (i: number) => {
    var j = i % 10,
      k = i % 100
    if (j == 1 && k != 11) {
      return i + 'st'
    }
    if (j == 2 && k != 12) {
      return i + 'nd'
    }
    if (j == 3 && k != 13) {
      return i + 'rd'
    }
    return i + 'th'
  }

  if (isLoading || betData === undefined) {
    return <Spin />
  }

  if (!user) {
    router.replace('/')
    return <Spin />
  }

  return (
    <>
      <Navbar />

      <Typography.Title>Your Bets</Typography.Title>

      <Timer canMakeBets={canMakeBets} setCanMakeBets={setCanMakeBets} />

      {canMakeBets &&
        (betData ? (
          <p>You have already placed a bet!</p>
        ) : (
          <p>Place your first bet!</p>
        ))}

      <Button
        disabled={!canMakeBets || betData}
        type='primary'
        onClick={() => setIsModalOpen(true)}
      >
        Make Bets
      </Button>

      <Modal
        centered
        title='Your Bets'
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Space key='footer'>
            <Button
              onClick={() => {
                setIsModalOpen(false)
              }}
            >
              Cancel
            </Button>

            <Button
              type='primary'
              loading={isBetsSubmitButtonLoading}
              onClick={() => {
                setIsBetsSubmitButtonLoading(true)
                onFinish()
              }}
            >
              Submit
            </Button>
          </Space>,
        ]}
      >
        <Form form={form}>
          {[...Array(props.teams.length)].map((e, i) => (
            <Form.Item
              rules={[
                {
                  required: true,
                  message: `Please select the team you bet will be ${ordinalOf(
                    i + 1
                  )}!`,
                },
              ]}
              name={`place${i}`}
              label={`${ordinalOf(i + 1)} Place`}
            >
              <Select>
                {props.teams.map((e) => (
                  <Select.Option value={e[0]}>{e[0]}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  )
}

export async function getServerSideProps() {
  const teams = await getTeamList()
  const games = await getGameList()

  return {
    props: {
      teams,
      games,
    },
  }
}
