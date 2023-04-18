import { auth } from '@/firebaseConfig'
import { Button, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [isBracketButtonLoading, setIsBracketButtonLoading] = useState(false)
  const [isBetsButtonLoading, setIsBetsButtonLoading] = useState(false)
  const [isLeaderboardButtonLoading, setIsLeaderboardButtonLoading] =
    useState(false)
  const [isTeamsButtonLoading, setIsTeamsButtonLoading] = useState(false)

  return (
    <Space>
      <Link href='/bracket'>
        <Button
          type='primary'
          loading={isBracketButtonLoading}
          disabled={router.pathname == '/bracket'}
          onClick={() => setIsBracketButtonLoading(true)}
        >
          Live Bracket
        </Button>
      </Link>

      <Link href='/bets'>
        <Button
          type='primary'
          loading={isBetsButtonLoading}
          disabled={router.pathname == '/bets'}
          onClick={() => setIsBetsButtonLoading(true)}
        >
          Bets
        </Button>
      </Link>

      <Link href='/leaderboard'>
        <Button
          type='primary'
          loading={isLeaderboardButtonLoading}
          disabled={router.pathname == '/leaderboard'}
          onClick={() => setIsLeaderboardButtonLoading(true)}
        >
          Leaderboard
        </Button>
      </Link>

      <Link href='/teams'>
        <Button
          type='primary'
          loading={isTeamsButtonLoading}
          disabled={router.pathname == '/teams'}
          onClick={() => setIsTeamsButtonLoading(true)}
        >
          Teams
        </Button>
      </Link>

      <Button
        type='primary'
        htmlType='submit'
        onClick={() => {
          auth.signOut()
          router.replace('/')
        }}
      >
        Sign Out
      </Button>
    </Space>
  )
}
