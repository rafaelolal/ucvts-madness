import { useAppContext } from '@/context/state'
import { getSheetData } from '@/sheets'
import { GameType } from '@/types'
import { Card, Input, Button, Form, Space, Table, Typography, Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import {
  Bracket,
  IRoundProps,
  Seed,
  SeedItem,
  SeedTeam,
  IRenderSeedProps,
} from 'react-brackets'

const pow2ceil = (v: number) => {
  var p = 2
  while ((v >>= 1)) {
    p <<= 1
  }
  return p
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

const CustomRoundTitle = (title: React.ReactNode, roundIndex: number) => {
  return <h3 style={{ textAlign: 'center' }}>{title}</h3>
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
                  seed.isFinished && team == winner ? 'green' : 'black',
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

export default function BracketPage(props: {
  winnersBracket: GameType[]
  losersBracket: GameType[]
  otherGames: GameType[]
  teamCount: number
}) {
  const { user, isLoading, notify } = useAppContext()
  const router = useRouter()

  if (isLoading) {
    return <Spin />
  }

  if (!user) {
    router.replace('/')
    return <Spin />
  }

  return (
    <>
      <h1>Welcome {user.email}</h1>

      <div style={{ overflowX: 'auto' }}>
        <Space>
          <div>
            <h1>Winners Bracket</h1>
            <Bracket
              mobileBreakpoint={0}
              roundTitleComponent={CustomRoundTitle}
              renderSeedComponent={CustomSeed}
              rounds={getRounds(props.winnersBracket, props.teamCount)}
            />
          </div>

          <div>
            <h1 className='text-end'>Losers Bracket</h1>
            <Bracket
              mobileBreakpoint={0}
              rtl={true}
              roundTitleComponent={CustomRoundTitle}
              renderSeedComponent={CustomSeed}
              rounds={getRounds(props.losersBracket, props.teamCount)}
            />
          </div>
        </Space>
      </div>

      <h1>Other Games</h1>

      <Space>
        {props.otherGames.map((game) => {
          if (!game.description) {
            return
          }

          return (
            <Space direction='vertical' style={{ backgroundColor: '#1677ff' }}>
              <h1>{game.description}</h1>
              <p>
                {game.team1Name} ({game.team2Name}) vs. {game.team1Points} (
                {game.team2Points})
              </p>
            </Space>
          )
        })}
      </Space>
    </>
  )
}

export async function getServerSideProps() {
  const teams = await getSheetData('Teams')
  const winnersBracket = await getSheetData("Winners' Bracket")
  const losersBracket = await getSheetData("Losers' Bracket")
  const otherGames = await getSheetData('Other Games')

  return {
    props: {
      winnersBracket,
      losersBracket,
      otherGames,
      teamCount: teams.length,
    },
  }
}
