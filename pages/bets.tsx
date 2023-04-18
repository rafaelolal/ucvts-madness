import Navbar from '@/components/navbar'
import { Button, Typography } from 'antd'
import { useEffect, useState } from 'react'

export default function BetsPage() {
  const [canMakeBets, setCanMakeBets] = useState(true)
  const [tournamentDatetime, setTournamentDatetime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const target = new Date('Tue Apr 20 2023 14:50:00 GMT-0400')

    const interval = setInterval(() => {
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTournamentDatetime({
        days,
        hours,
        minutes,
        seconds,
      })

      if ([days, hours, minutes, seconds].every((value) => value <= 0)) {
        setCanMakeBets(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />

      {canMakeBets ? (
        <>
          <Typography.Title>Time Until Tournament</Typography.Title>
          <Typography.Text>
            {tournamentDatetime.days} days and {tournamentDatetime.hours}:
            {tournamentDatetime.minutes}:{tournamentDatetime.seconds}
          </Typography.Text>
        </>
      ) : (
        <p>Games Already Started</p>
      )}

      <Typography.Title>Your Bets</Typography.Title>

      <Button disabled={!canMakeBets} type='primary'>
        Make Bets
      </Button>
    </>
  )
}
