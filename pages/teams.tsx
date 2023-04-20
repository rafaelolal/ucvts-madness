import { Card, Input, Button, Form, Space, Table, Typography } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import { getGameList, getTeamList } from '@/sheets'
import Navbar from '@/components/navbar'

const getDataSource = (teams: string[][]) => {
  teams.sort((a, b) => a[0].localeCompare(b[0]))

  const dataSource: { name: string; players: string }[] = []
  for (var team of teams) {
    dataSource.push({ name: team[0], players: team.slice(1).join(', ') })
  }

  return dataSource
}

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Players',
    dataIndex: 'players',
    key: 'players',
  },
]

export default function TeamsPage(props: { teams: string[][] }) {
  return (
    <>
      <h1>Teams</h1>

      <Table
        pagination={{
          defaultPageSize: 10,
        }}
        dataSource={getDataSource(props.teams)}
        columns={columns}
      />
    </>
  )
}

export async function getServerSideProps() {
  const teams = await getTeamList()

  return {
    props: {
      teams,
    },
  }
}
