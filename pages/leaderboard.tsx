import axios from 'axios'
import { Card, Input, Button, Form, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { useState } from 'react'

const getDataSource = (data: { name: string; points: number }[]) => {
  data.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))

  const dataSource: { names: string[]; points: number; rank: number }[] = []

  var currentNames: string[] = []
  var currentPoints: number = data[0].points
  var rank = 1
  for (var user of data) {
    if (user.points != currentPoints) {
      dataSource.push({
        names: currentNames,
        points: currentPoints,
        rank: rank,
      })
      currentPoints = user.points
      currentNames = []
      rank++
    }
    currentNames.push(user.name)
  }
  dataSource.push({ names: currentNames, points: currentPoints, rank: rank })

  return dataSource
}

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_: any, record: { names: string[]; points: number }) =>
      record.names.map((name) => <Typography.Text>{name}</Typography.Text>),
  },
  {
    title: 'Points',
    dataIndex: 'points',
    key: 'points',
  },
]

export default function LeaderboardPage(props: {
  data: { name: string; points: number }[]
}) {
  const [isLiveBracketButtonLoading, setIsLiveBracketButtonLoading] =
    useState(false)

  return (
    <>
      <Typography.Title>Leaderboard</Typography.Title>

      <Link href='/bracket/'>
        <Button
          type='primary'
          loading={isLiveBracketButtonLoading}
          onClick={() => setIsLiveBracketButtonLoading(true)}
        >
          Live Bracket
        </Button>
      </Link>

      <Table
        pagination={{
          defaultPageSize: 10,
        }}
        dataSource={getDataSource(props.data)}
        columns={columns}
      />
    </>
  )
}

export async function getServerSideProps() {
  const response = await axios
    .get('http://127.0.0.1:8000/api/users/')
    .then((response) => response)
    .catch((error) => {
      throw error
    })

  return { props: { data: response.data } }
}
