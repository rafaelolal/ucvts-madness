import Navbar from '@/components/navbar'
import SignInRequired from '@/components/sign-in-required'
import { useAppContext } from '@/context/state'
import { auth } from '@/firebaseConfig'
import { getGameList, getTeamList } from '@/sheets'

import { Card, Input, Button, Form, Space, Table, Typography, Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

export default function BracketPage(props: {
  teams: string[][]
  games: string[][]
}) {
  const { user, isLoading, notify } = useAppContext()
  const router = useRouter()

  const pow2ceil = (v: number) => {
    var p = 2
    while ((v >>= 1)) {
      p <<= 1
    }
    return p
  }

  const buildBracket = () => {
    // for n teams, there are n-1 games. * 2 for double elimination
    // ceil to power of 2 to make perfect bracket, and then subtract 1
    const gameCount = pow2ceil((props.teams.length - 1) * 2) - 1
    var myBorderColor = '#0F0'
    const numberOfLevels = 1 + Math.floor(Math.log2(gameCount))
    var toColor = numberOfLevels - 1

    console.log({ toColor })
    const gameComponents = []
    // creating all game components, games not
    // decided yet should have dashes "-" in the sheet
    for (var i = 0; i < gameCount; i++) {
      const game = props.games[i]
      gameComponents.push(
        <Fragment key={`filled-${game[0]}${game[1]}`}>
          <li className='spacer'>&nbsp;</li>

          <li
            style={{ borderColor: myBorderColor }}
            className={`game game-top ${
              game[4] == 'Yes' && +game[2] > +game[3] && 'winner'
            }`}
          >
            {game[0] || '\xA0'} <span>{game[2] || '\xA0'}</span>
          </li>

          <li
            style={{ borderColor: myBorderColor }}
            className='game game-spacer'
          >
            {game[5] || '\xA0'}
          </li>

          <li
            style={{ borderColor: myBorderColor }}
            className={`game game-bottom ${
              game[4] == 'Yes' && +game[3] > +game[2] && 'winner'
            }`}
          >
            {game[1] || '\xA0'} <span>{game[3] || '\xA0'}</span>
          </li>
        </Fragment>
      )

      if ((i + 1) % toColor == 0) {
        myBorderColor = myBorderColor == '#0F0' ? '#F00' : '#0F0'
      }
      if ((i + 1) % (toColor * 2) == 0) {
        toColor /= 2
      }
    }

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
    return <Spin />
  }

  if (!user) {
    router.replace('/')
    return <Spin />
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
          <Typography.Title>
            {props.games[props.games.length - 3][5]}
          </Typography.Title>
          <Typography.Text>
            {props.games[props.games.length - 3][0]} (
            {props.games[props.games.length - 3][2]}) vs.{' '}
            {props.games[props.games.length - 3][1]} (
            {props.games[props.games.length - 3][3]})
          </Typography.Text>
        </Space>

        <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
          <Typography.Title>
            {props.games[props.games.length - 2][5]}
          </Typography.Title>
          <Typography.Text>
            {props.games[props.games.length - 2][0]} (
            {props.games[props.games.length - 2][2]}) vs.{' '}
            {props.games[props.games.length - 2][1]} (
            {props.games[props.games.length - 2][3]})
          </Typography.Text>
        </Space>

        <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
          <Typography.Title>
            {props.games[props.games.length - 1][5]}
          </Typography.Title>
          <Typography.Text>
            {props.games[props.games.length - 1][0]} (
            {props.games[props.games.length - 1][2]}) vs.{' '}
            {props.games[props.games.length - 1][1]} (
            {props.games[props.games.length - 1][3]})
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
