import Navbar from '@/components/navbar'
import SignInRequired from '@/components/sign-in-required'
import { useAppContext } from '@/context/state'
import { auth } from '@/firebaseConfig'
import { getGameList, getTeamList } from '@/sheets'

import { Card, Input, Button, Form, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

export default function BracketPage(props: {
  teams: string[][]
  games: string[][]
}) {
  const { user, isLoading, notify } = useAppContext()

  function nearestPowerOf2(n: number) {
    return 1 << (31 - Math.clz32(n))
  }

  const buildBracket = () => {
    const teamCount = 8 // nearestPowerOf2(props.teams.length + 1)
    const gameCount = 15 // teamCount - 1
    const gameComponents = []
    // creating all game components, games not
    // decided yet should have dashes "-" in the sheet
    for (var i = 0; i < gameCount; i++) {
      const game = props.games[i]
      gameComponents.push(
        <Fragment key={`filled-${game[0]}${game[1]}`}>
          <li className='spacer'>{i == 4 ? 'Losers Bracket' : `\xA0`}</li>

          <li
            className={`game game-top ${
              game[4] == 'Yes' && +game[2] > +game[3] && 'winner'
            }`}
          >
            {game[0]} <span>{game[2]}</span>
          </li>

          <li className='game game-spacer'>{game[5]}</li>

          <li
            className={`game game-bottom ${
              game[4] == 'Yes' && +game[3] > +game[2] && 'winner'
            }`}
          >
            {game[1]} <span>{game[3]}</span>
          </li>
        </Fragment>
      )
    }

    const numberOfLevels = 4 // 1 + Math.floor(Math.log2(gameCount))
    var addGames = 1
    const roundComponents = []
    // the bracket requires knowledge of how many levels the binary
    // tree will have, this creates and adds games to "rounds"
    // bracket is built "backwards," it starts by creating the last
    // round and adding the last game
    for (var i = numberOfLevels; i > 0; i--) {
      if (gameComponents.length < addGames) {
        break
      }

      roundComponents.push(
        <ul
          key={i}
          className={`round round-${i}`}
          children={gameComponents.slice(-addGames).concat([
            <li key={`final-spacer-${i}`} className='spacer'>
              &nbsp;
            </li>,
          ])}
        />
      )

      // popping out the game components set as children
      // to the round created above
      for (var j = 0; j < addGames; j++) {
        gameComponents.pop()
      }

      // a round is created every iteration
      // rounds are created last to first, so
      // numbers of games per round increase as we go
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
      <Navbar />

      <Typography.Title>Welcome {user.email}</Typography.Title>

      <Typography.Title>Live Bracket</Typography.Title>

      <div className='bracket'>{buildBracket().reverse()}</div>

      <Typography.Title>Other Games</Typography.Title>

      <Space>
        <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
          <Typography.Title>{props.games[15][5]}</Typography.Title>
          <Typography.Text>
            {props.games[15][0]} ({props.games[15][2]}) vs. {props.games[15][1]}{' '}
            ({props.games[15][3]})
          </Typography.Text>
        </Space>

        <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
          <Typography.Title>{props.games[16][5]}</Typography.Title>
          <Typography.Text>
            {props.games[16][0]} ({props.games[16][2]}) vs. {props.games[16][1]}{' '}
            ({props.games[16][3]})
          </Typography.Text>
        </Space>

        <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
          <Typography.Title>{props.games[17][5]}</Typography.Title>
          <Typography.Text>
            {props.games[17][0]} ({props.games[17][2]}) vs. {props.games[17][1]}{' '}
            ({props.games[17][3]})
          </Typography.Text>
        </Space>
      </Space>
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
