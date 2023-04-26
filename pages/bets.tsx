import { useAppContext } from '@/context/state'
import { getSheetData } from '@/sheets'
import { Button, Form, Select, Spin, Typography } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Timer from '@/components/timer'
import { TeamType } from '@/types'
import SignInRequired from '@/components/sign-in-required'
import Loading from '@/components/loading'
import {
  Bracket,
  Seed,
  SeedItem,
  SeedTeam,
  IRenderSeedProps,
} from 'react-brackets'
import { pow2ceil } from '@/helpers'
import { Agent } from 'https'

const httpsAgent = new Agent({
  rejectUnauthorized: false,
})

const CustomRoundTitle = (title: React.ReactNode, roundIndex: number) => {
  return <h6 style={{ textAlign: 'center' }}>{title}</h6>
}

const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
}: IRenderSeedProps) => {
  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem>
        <SeedTeam>
          <Form.Item
            help={
              <Typography.Text style={{ color: 'white' }}>{`Winner of Game ${
                (seed.id as number) + 1
              }`}</Typography.Text>
            }
            rules={[
              {
                required: true,
              },
            ]}
            name={`bet${seed.id}`}
          >
            <Select
              disabled={seed.bet}
              style={{
                width: '183px',
                backgroundColor: 'white',
                borderRadius: '7px',
              }}
            >
              {[{ name: 'N/A', players: [''] }]
                .concat(seed.allTeamNames)
                .map((team, i) => (
                  <Select.Option key={i} value={team.name}>
                    {team.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </SeedTeam>
      </SeedItem>
    </Seed>
  )
}

const getRounds = (
  teamCount: number,
  teams: TeamType[],
  bets: string | null | undefined
) => {
  const gameCount = pow2ceil(teamCount - 1) - 1
  const roundCount = Math.floor(Math.log2(gameCount)) + 1

  var formattedBets
  if (bets) {
    formattedBets = bets.split('*')
  }

  const seeds = []
  for (var i = 0; i < gameCount; i++) {
    var bet = null
    if (formattedBets) {
      bet = formattedBets[i]
    }
    seeds.push({
      id: i,
      bet: bet,
      allTeamNames: teams,
      teams: [],
    })
  }

  const rounds = []
  var addGames = 1
  for (var i = roundCount; i > 0; i--) {
    if (seeds.length < addGames) {
      break
    }

    rounds.push({
      title: `Round ${i}`,
      seeds: seeds.slice(-addGames),
    })

    for (var j = 0; j < addGames; j++) {
      seeds.pop()
    }

    addGames *= 2
  }

  return rounds.reverse()
}

export default function BetsPage(props: {
  studentTeams: TeamType[]
  teacherTeams: TeamType[]
}) {
  const { user, isLoading, notify } = useAppContext()

  const [canMakeBets, setCanMakeBets] = useState(true)
  const [betData, setBetData] = useState<string | null | undefined>(undefined)
  const [isBetsSubmitButtonLoading, setIsBetsSubmitButtonLoading] =
    useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if (!user) {
      return
    }

    axios
      .get(
        `https://ralmeida.dev/ucvts_madness_server/api/user/${user.uid}/bet/`,
        {
          httpsAgent: httpsAgent,
        }
      )
      .then((response) => {
        var initialValues: any = {} // fix datatype, I don't know how though
        const formattedBets = response.data.order.split('*')
        for (var i = 0; i < formattedBets.length; i++) {
          initialValues[`bet${i}`] = formattedBets[i]
        }
        form.setFieldsValue(initialValues)
        setBetData(response.data.order)
      })
      .catch((error) => {
        console.log({ error })
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
        .post(
          'https://ralmeida.dev/ucvts_madness_server/api/bet/create/',
          {
            user: user!.uid,
            order: Object.values(values).join('*'),
          },
          {
            httpsAgent: httpsAgent,
          }
        )
        .then(() => {
          notify.success({
            message: 'Bets placed successfully!',
            position: 'bottomRight',
          })
          setBetData(Object.values(values).join('*'))
          setIsBetsSubmitButtonLoading(false)
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
    <div className='container my-4'>
      <h1 className='text-center basketball2 fs-huge m-0'>
        Bets
        <img
          style={{ width: '40px' }}
          src='/ucvts-madness/icons8-basketball-64 (1).png'
        ></img>
      </h1>

      <Timer canMakeBets={canMakeBets} setCanMakeBets={setCanMakeBets} />

      <h3>Your Bets</h3>

      <p>
        Place your bets wisely, you can only do it once! Pay close attention to
        the teams playing each game. The games are labeled in the live bracket
        page. If there are no teams for a game, bet N/A.
      </p>

      <div
        className='p-3'
        style={{
          backgroundColor: '#81b6fc',
          overflowX: 'auto',
          margin: '0 -1.25rem',
          boxShadow: '0px 0px 11px 2px rgba(0,0,0,0.2)',
        }}
      >
        <Bracket
          mobileBreakpoint={0}
          roundTitleComponent={CustomRoundTitle}
          renderSeedComponent={CustomSeed}
          rounds={getRounds(
            props.studentTeams.length,
            props.studentTeams.concat(props.teacherTeams),
            betData
          )}
        />
      </div>

      {canMakeBets && !betData && (
        <button
          className='btn btn-primary mt-4'
          onClick={() => {
            setIsBetsSubmitButtonLoading(true)
            onFinish()
          }}
        >
          {isBetsSubmitButtonLoading ? <Spin /> : 'Place Bets'}
        </button>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  const studentTeams = await getSheetData('Student Teams')
  const teacherTeams = await getSheetData('Teacher Teams')
  return {
    props: {
      studentTeams,
      teacherTeams,
    },
  }
}
