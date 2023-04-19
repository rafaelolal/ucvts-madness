import { Typography } from 'antd'
import { useEffect, useState } from 'react'

export default function Timer(props: {
  canMakeBets: any
  setCanMakeBets: any
}) {
  const [tournamentDatetime, setTournamentDatetime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const target = new Date('Tue Apr 27 2023 3:00:00 GMT-0400')

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
        props.setCanMakeBets(false)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {props.canMakeBets ? (
        <>
          <Typography.Title>Time Until Tournament</Typography.Title>
          <Typography.Text>
            {tournamentDatetime.days} days and {tournamentDatetime.hours}:
            {tournamentDatetime.minutes}:{tournamentDatetime.seconds}
          </Typography.Text>
        </>
      ) : (
        <p>No more bets, tournament started!</p>
      )}
    </>
  )
}
