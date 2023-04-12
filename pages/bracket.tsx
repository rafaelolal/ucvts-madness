import SignInRequired from '@/components/sign-in-required'
import { useAppContext } from '@/context/state'
import { getGameList, getTeamList } from '@/sheets'

import { Card, Input, Button, Form, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { useState } from 'react'

export default function BracketPage(props: {
  teams: string[][]
  games: string[][]
}) {
  const { user, isLoading, notify } = useAppContext()
  const [isViewingLiveBracket, setIsViewingLiveBracket] = useState(true)
  const [isLeaderboardButtonLoading, setIsLeaderboardButtonLoading] =
    useState(false)
  const [isTeamsButtonLoading, setIsTeamsButtonLoading] = useState(false)

  function nearestPowerOf2(n: number) {
    return 1 << (31 - Math.clz32(n))
  }

  const buildBracket = () => {
    const teamCount = nearestPowerOf2(props.teams.length + 1)
    const gameCount = teamCount - 1
    const gameComponents = []
    for (const game of props.games) {
      gameComponents.push(
        <>
          <li className='spacer'>&nbsp;</li>

          <li
            className={`game game-top ${
              game[4] == 'Yes' && +game[2] > +game[3] && 'winner'
            }`}
          >
            {game[0]} <span>{game[2]}</span>
          </li>

          <li className='game game-spacer'>&nbsp;</li>

          <li
            className={`game game-bottom ${
              game[4] == 'Yes' && +game[3] > +game[2] && 'winner'
            }`}
          >
            {game[1]} <span>{game[3]}</span>
          </li>
        </>
      )
    }

    for (var i = 0; i < gameCount - props.games.length; i++) {
      gameComponents.push(
        <>
          <li className='spacer'>&nbsp;</li>

          <li className='game game-top'>
            N/A <span>0</span>
          </li>

          <li className='game game-spacer'>&nbsp;</li>

          <li className='game game-bottom'>
            N/A <span>0</span>
          </li>
        </>
      )
    }

    const numberOfLevels = 1 + Math.floor(Math.log2(gameCount))
    var addGames = 1
    const roundComponents = []
    for (var i = numberOfLevels; i > 0; i--) {
      if (gameComponents.length < addGames) {
        break
      }

      roundComponents.push(
        <ul
          className={`round round-${i}`}
          children={gameComponents
            .slice(-addGames)
            .concat([<li className='spacer'>&nbsp;</li>])}
        ></ul>
      )
      for (var j = 0; j < addGames; j++) {
        gameComponents.pop()
      }

      addGames *= 2
    }

    return roundComponents
  }

  if (isLoading) {
    return <Typography.Title>Loading...</Typography.Title>
  }

  if (!user) {
    return <SignInRequired />
  }

  return (
    <>
      <Space>
        <Button
          type='primary'
          htmlType='submit'
          onClick={() => setIsViewingLiveBracket(!isViewingLiveBracket)}
        >
          {isViewingLiveBracket ? 'Your Bets' : 'Live Bracket'}
        </Button>

        <Link href='/leaderboard/'>
          <Button
            type='primary'
            loading={isLeaderboardButtonLoading}
            onClick={() => setIsLeaderboardButtonLoading(true)}
          >
            Leaderboard
          </Button>
        </Link>

        <Link href='/teams/'>
          <Button
            type='primary'
            loading={isTeamsButtonLoading}
            onClick={() => setIsTeamsButtonLoading(true)}
          >
            Teams
          </Button>
        </Link>
      </Space>

      <Typography.Title>Welcome {user.email}</Typography.Title>
      {isViewingLiveBracket ? (
        <>
          <Typography.Title>Live Bracket</Typography.Title>

          <div className='bracket'>{buildBracket().reverse()}</div>
        </>
      ) : (
        <Typography.Title>Your Bets</Typography.Title>
      )}
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
