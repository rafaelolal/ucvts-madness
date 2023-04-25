import Loading from '@/components/loading'
import { useAppContext } from '@/context/state'
import { pow2ceil } from '@/helpers'
import { getSheetData } from '@/sheets'
import { GameType } from '@/types'
import { Space } from 'antd'
import {
  Bracket,
  Seed,
  SeedItem,
  SeedTeam,
  IRenderSeedProps,
} from 'react-brackets'

const CustomRoundTitle = (title: React.ReactNode, roundIndex: number) => {
  return <h4 style={{ textAlign: 'center' }}>{title}</h4>
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
      <SeedItem>
        <div>
          {seed.teams.map((team, i) => (
            <SeedTeam
              className='justify-content-between'
              style={{
                backgroundColor:
                  seed.isFinished && team == winner ? 'orange' : 'blue',
              }}
            >
              <p>{team.name || '\xa0'}</p>
              <p>{team.points || '\xa0'}</p>
            </SeedTeam>
          ))}
        </div>
      </SeedItem>

      <div>
        <p style={{ margin: 0, padding: 0, color: '#aaa' }}>
          {seed.description}
        </p>
      </div>
    </Seed>
  )
}

const getRounds = (games: GameType[], teamCount: number) => {
  console.log({ teamCount })
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

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className='mt-3'>
        {user && (
          <h6 className='ms-3 fc-grey' style={{ fontSize: '0.8rem' }}>
            Welcome {user.email}
          </h6>
        )}

        <h2 className='ms-3 mb-5' style={{ fontFamily: 'galactic' }}>
          Live Bracket
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <Bracket
            mobileBreakpoint={0}
            roundTitleComponent={CustomRoundTitle}
            renderSeedComponent={CustomSeed}
            rounds={getRounds(props.winnersBracket, props.teamCount)}
          />
        </div>

        <h2 className='ms-3 mt-5' style={{ fontFamily: 'galactic' }}>
          Other Games
        </h2>

        <Space>
          <div className='px-3 bg-primary shadow'>
            <div className='row py-3'>
              {props.otherGames.map((game) => {
                if (!game.description) {
                  return
                }

                return (
                  <div className='col'>
                    <h1>{game.description}</h1>
                    {game.team1Name} ({game.team2Name}) vs. {game.team1Points} (
                    {game.team2Points})
                  </div>
                )
              })}
            </div>
          </div>
        </Space>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const teams = await getSheetData('Student Teams')
  const winnersBracket = await getSheetData("Winners' Bracket")
  const otherGames = await getSheetData('Other Games')

  return {
    props: {
      winnersBracket,
      otherGames,
      teamCount: teams!.length,
    },
  }
}
