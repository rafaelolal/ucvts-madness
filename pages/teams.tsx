import { Table, Typography } from 'antd'
import { getSheetData } from '@/sheets'
import { TeamType } from '@/types'

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
  },
  {
    title: 'Players',
    dataIndex: 'players',
    key: 'players',
    render: (_: any, record: TeamType) =>
      record.players.map((name, i) => (
        <p className='m-0' key={i}>
          {name}
        </p>
      )),
  },
]

export default function TeamsPage(props: { teams: TeamType[] }) {
  return (
    <div className='container my-4'>
      <h1 className='text-center basketball2 fs-huge mb-4'>
        Teams
        <img
          style={{ width: '40px' }}
          src='/ucvts-madness/icons8-basketball-64 (1).png'
        ></img>
      </h1>
      <div className='col-12 col-md-7 mx-auto'>
        <div style={{ boxShadow: ' 0 0rem 0.5rem rgba(0,0,0, .15)' }}>
          <Table
            bordered={true}
            pagination={false}
            dataSource={props.teams}
            columns={columns}
          />
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const teams = ((await getSheetData('Student Teams')) as TeamType[])?.concat(
    (await getSheetData('Teacher Teams')) as TeamType[]
  )

  return {
    props: {
      teams,
    },
  }
}
