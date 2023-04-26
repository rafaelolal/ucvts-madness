import Loading from '@/components/loading'
import { useAppContext } from '@/context/state'
import { addEllipsis, pow2ceil } from '@/helpers'
import { getSheetData } from '@/sheets'
import { GameType } from '@/types'
import { Space, Typography } from 'antd'
import {
  Bracket,
  Seed,
  SeedItem,
  SeedTeam,
  IRenderSeedProps,
} from 'react-brackets'
import axios from 'axios'
import useSWR from 'swr'

const CustomRoundTitle = (title: React.ReactNode, roundIndex: number) => {
  return <h6 style={{ textAlign: 'center' }}>{title}</h6>
}

const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
}: IRenderSeedProps) => {
  const winner = seed.teams.find(
    (team) => team.points == Math.max(...seed.teams.map((team) => team.points))
  )

  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem
        className='p-2'
        style={{
          boxShadow: '0px 0px 0px #000',
        }}
      >
        <div>
          {seed.teams.map((team, i) => (
            <SeedTeam
              key={i}
              className='justify-content-between mb-1'
              style={{
                minWidth: '200px',
                backgroundColor: !seed.isFinished
                  ? '#fff'
                  : seed.isFinished && team == winner
                  ? '#fe8e22'
                  : '#D3D3D3',

                color: !seed.isFinished
                  ? '#000'
                  : seed.isFinished && team == winner
                  ? '#000'
                  : 'grey',
              }}
            >
              <p className='m-0'>
                {addEllipsis(team.name as string, 22) || '\xa0'}
              </p>
              <p className='m-0'>{team.points}</p>
            </SeedTeam>
          ))}
        </div>
      </SeedItem>

      <div>
        <p style={{ margin: 0, padding: 0, color: '#000' }}>
          {seed.description}
        </p>
      </div>
    </Seed>
  )
}

const getRounds = (games: GameType[], teamCount: number) => {
  const gameCount = pow2ceil(teamCount - 1) - 1
  const roundCount = Math.floor(Math.log2(gameCount)) + 1

  const seeds = []
  for (var i = 0; i < gameCount; i++) {
    seeds.push({
      id: i,
      teams: [
        {
          name: games[i].team1Name,
          points: games[i].team1Points ? +games[i].team1Points : 0,
        },
        {
          name: games[i].team2Name,
          points: games[i].team2Points ? +games[i].team2Points : 0,
        },
      ],
      isFinished: games[i].isFinished,
      description: games[i].description,
    })
  }

  const rounds = []
  var addGames = 1
  // the bracket requires knowledge of how many levels the binary
  // tree will have, this creates and adds seeds to "rounds."
  // bracket is built "backwards," it starts by creating the last
  // round and adding the last seed
  for (var i = roundCount; i > 0; i--) {
    if (seeds.length < addGames) {
      break
    }

    rounds.push({
      title: `Round ${i}`,
      seeds: seeds.slice(-addGames),
    })

    // popping out the seeds sliced in above
    for (var j = 0; j < addGames; j++) {
      seeds.pop()
    }

    // a round is created every iteration.
    // rounds are created last to first, so
    // numbers of seeds per round increase as we go
    addGames *= 2
  }

  return rounds.reverse()
}

export default function BracketPage(props: {
  winnersBracket: GameType[]
  otherGames: GameType[]
  teamCount: number
}) {
  const { user, isLoading } = useAppContext()

  const {
    data: winnersBracket,
    error: winnersBracketError,
    mutate: mutateWinnersBracket,
  } = useSWR('/ucvts-madness/api/getWinnersBracket', async (url: string) => {
    return await axios
      .get(url)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  })

  const {
    data: otherGames,
    error: otherGamesError,
    mutate: mutateOtherGames,
  } = useSWR('/ucvts-madness/api/getOtherGames', async (url: string) => {
    return await axios
      .get(url)
      .then((response) => response.data.data)
      .catch((error) => {
        throw error
      })
  })

  const mutateData = () => {
    mutateWinnersBracket()
    mutateOtherGames()
    axios
      .post('http://127.0.0.1:8000/api/leaderboard/update/', winnersBracket)
      .then(() => {})
      .catch((error) => {
        throw error
      })
    setTimeout(mutateData, 120 * 1000)
  }

  if (winnersBracketError || otherGamesError) {
    return <h1>Error</h1>
  }

  if (isLoading || !winnersBracket || !otherGames) {
    return <Loading />
  }

  mutateData()

  return (
    <>
      <div className='container my-4'>
        {user && (
          <h6 className=' text-center text-grey' style={{ fontSize: '0.8rem' }}>
            Welcome {user.email}
          </h6>
        )}

        <h1 className='basketball2 fs-huge mb-5 text-center'>
          Live Bracket
          <img
            style={{ width: '40px' }}
            src='/ucvts-madness/icons8-basketball-64 (1).png'
          ></img>
        </h1>

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
            rounds={getRounds(winnersBracket, props.teamCount)}
          />
        </div>

        <h3 className=' mt-5'>Other Games</h3>

        <div className='row row-cols-2 row-cols-md-3 m-1 justify-content-center'>
          {otherGames.map((game: GameType, i: number) => {
            if (!game.description) {
              return
            }

            return (
              <div className='col p-2'>
                <div className=' p-2 w-100 h-100 text-center bg-primary shadow'>
                  <h3>{game.description}</h3>
                  <h6>
                    {game.team1Name} ({game.team2Name})
                  </h6>
                  <h6>vs.</h6>
                  <h6>
                    {game.team1Points} ({game.team2Points})
                  </h6>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const teams = await getSheetData('Student Teams')
  return {
    props: {
      teamCount: teams!.length,
    },
  }
}
