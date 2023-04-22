import { Table } from 'antd'
import { getSheetData } from '@/sheets'
import { TeamType } from '@/types'

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
    render: (_: any, record: TeamType) =>
      record.players.map((name) => <p>{name}</p>),
  },
]

export default function TeamsPage(props: { teams: TeamType[] }) {
  return (
    <>
      <h1>Teams</h1>

      <Table pagination={false} dataSource={props.teams} columns={columns} />
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
