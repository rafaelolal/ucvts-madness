import axios from 'axios'
import { Table, Typography } from 'antd'
import { Agent } from 'https'

const httpsAgent = new Agent({
  rejectUnauthorized: false,
})

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
      record.names.map((name, i) => (
        <Typography.Text key={i}>{name}</Typography.Text>
      )),
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
  return (
    <div className='container my-4'>
      <h1 className='text-center basketball2 fs-huge mb-4'>
        Leaderboard
        <img
          style={{ width: '40px' }}
          src='/ucvts-madness/icons8-basketball-64 (1).png'
        ></img>
      </h1>

      <p className='text-center'>
        This leaderboard is for bets. The more accurate your bets are, the more
        points you will get!
      </p>

      <div style={{ boxShadow: ' 0 0rem 0.5rem rgba(0,0,0, .15)' }}>
        <Table
          pagination={false}
          dataSource={getDataSource(props.data)}
          columns={columns}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await axios
    .get('https://ralmeida.dev/ucvts_madness_server/api/users/', {
      httpsAgent: httpsAgent,
    })
    .then((response) => response)
    .catch((error) => {
      throw error
    })

  return { props: { data: response.data } }
}
