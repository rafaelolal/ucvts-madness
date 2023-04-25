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
        <div className='col-11 mx-auto my-5'>
          <div className='container-fluid bg-secondary rounded-2 shadow text-light p-3'>
            <h2 className='mt-3 mb-4'>Time Until Tournament!</h2>
            <div className='col-11 mx-auto'>
              <div
                className='row flex-row justify-content-around my-4 rounded-1'
                style={{ border: '2px solid #fff' }}
              >
                <div className='col-auto px-2 py-3'>
                  <h3 className='fs-huge m-0 monospace'>
                    {tournamentDatetime.days}
                  </h3>
                  <h6 className='fs-tiny m-0'>DAYS</h6>
                </div>
                <h3 className='colon fs-huge'>:</h3>

                <div className='col-auto  px-2 py-3'>
                  <h3 className='fs-huge m-0 monospace'>
                    {tournamentDatetime.hours}
                  </h3>
                  <h6 className='fs-tiny m-0'>HOURS</h6>
                </div>
                <h3 className='colon fs-huge'>:</h3>
                <div className='col-auto  px-2 py-3'>
                  <h3 className='fs-huge m-0 monospace'>
                    {tournamentDatetime.minutes}
                  </h3>
                  <h6 className='fs-tiny m-0'>MINUTES</h6>
                </div>
                <h3 className='colon fs-huge'>:</h3>
                <div className='col-auto px-2 py-3'>
                  <h3 className='fs-huge m-0 monospace'>
                    {tournamentDatetime.seconds}
                  </h3>
                  <h6 className='fs-tiny m-0'>SECONDS</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No more bets, tournament started!</p>
      )}
    </>
  )
}
