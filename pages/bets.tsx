import { useAppContext } from '@/context/state'
import { getSheetData } from '@/sheets'
import { Button, Form, Modal, Select, Space } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Timer from '@/components/timer'
import { TeamType } from '@/types'
import SignInRequired from '@/components/sign-in-required'
import Loading from '@/components/loading'

export default function BetsPage(props: { teams: TeamType[] }) {
  const { user, isLoading, notify } = useAppContext()

  const [canMakeBets, setCanMakeBets] = useState(true)
  const [betData, setBetData] = useState<string | null | undefined>(undefined)
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
      .then((response) => setBetData(response.data.order))
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
          user: user!.uid,
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

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <SignInRequired message={'Sign in to place bets and win prizes!'} />
  }

  return (
    <>
      <h1>Bets for Winners' Bracket Only</h1>

      <Timer canMakeBets={canMakeBets} setCanMakeBets={setCanMakeBets} />

      {canMakeBets &&
        (betData ? (
          <p>You have already placed a bet!</p>
        ) : (
          <p>Place your first bet!</p>
        ))}

      <Button
        disabled={!canMakeBets || Boolean(betData)}
        type='primary'
        onClick={() => setIsModalOpen(true)}
      >
        Place Bets
      </Button>

      <p>Your bets</p>
      {betData &&
        betData.split('*').map((bet, i) => (
          <p>
            Winner of Game {i + 1}: {bet}
          </p>
        ))}

      <Modal
        centered
        title="Bets for Winners' Bracket Only"
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
                  message: `Select winner of the winners' bracket Game ${
                    i + 1
                  }!`,
                },
              ]}
              name={`place${i}`}
              label={`Winner of Game ${i + 1}`}
            >
              <Select>
                {[{ name: 'N/A', players: [''] }]
                  .concat(props.teams)
                  .map((team) => (
                    <Select.Option value={team.name}>{team.name}</Select.Option>
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
  const teams = await getSheetData('Teams')

  return {
    props: {
      teams,
    },
  }
}
