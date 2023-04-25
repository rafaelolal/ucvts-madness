import { useAppContext } from '@/context/state'
import { auth } from '@/firebaseConfig'
import { Button, Space } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Navbar() {
  const { user, isLoading } = useAppContext()
  const router = useRouter()
  const [isBracketButtonLoading, setIsBracketButtonLoading] = useState(false)
  const [isBetsButtonLoading, setIsBetsButtonLoading] = useState(false)
  const [isLeaderboardButtonLoading, setIsLeaderboardButtonLoading] =
    useState(false)
  const [isTeamsButtonLoading, setIsTeamsButtonLoading] = useState(false)

  return (
    <nav className='navbar bg-body-tertiary shadow-sm'>
      <div className='container-fluid'>
        <a className='navbar-brand' href='#'>
          UCVTS Madness
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasNavbar'
          aria-controls='offcanvasNavbar'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className='offcanvas offcanvas-end'
          id='offcanvasNavbar'
          aria-labelledby='offcanvasNavbarLabel'
          style={{ width: '70%' }}
        >
          <div className='offcanvas-header'>
            <h5 className='offcanvas-title' id='offcanvasNavbarLabel'>
              Navigation
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='offcanvas'
              aria-label='Close'
            ></button>
          </div>
          <div className='offcanvas-body'>
            <ul className='navbar-nav justify-content-end flex-grow-1 pe-3'>
              <li className='nav-item w-100 px-3 py-2 '>
                <Link href='/bracket'>
                  <Button
                    className='w-100 btnBlue shadow-sm'
                    type='primary'
                    loading={isBracketButtonLoading}
                    disabled={router.pathname == '/bracket'}
                    onClick={() => setIsBracketButtonLoading(true)}
                  >
                    Live Bracket
                  </Button>
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link href='/bets'>
                  <Button
                    className='w-100 btnBlue shadow-sm'
                    type='primary'
                    loading={isBetsButtonLoading}
                    disabled={router.pathname == '/bets'}
                    onClick={() => setIsBetsButtonLoading(true)}
                  >
                    Bets
                  </Button>
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link href='/leaderboard'>
                  <Button
                    className='w-100 btnBlue shadow-sm'
                    type='primary'
                    loading={isLeaderboardButtonLoading}
                    disabled={router.pathname == '/leaderboard'}
                    onClick={() => setIsLeaderboardButtonLoading(true)}
                  >
                    Leaderboard
                  </Button>
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link href='/teams'>
                  <Button
                    className='w-100 btnBlue shadow-sm'
                    type='primary'
                    loading={isTeamsButtonLoading}
                    disabled={router.pathname == '/teams'}
                    onClick={() => setIsTeamsButtonLoading(true)}
                  >
                    Teams
                  </Button>
                </Link>
              </li>
              <li className='nav-item w-100 px-3 py-2'>
                {isLoading ? (
                  <div className='btnOrange'>
                    <Button
                      className='w-100'
                      type='primary'
                      loading={true}
                      disabled={true}
                    />
                  </div>
                ) : user ? (
                  <Button
                    className='w-100 btnOrange'
                    type='primary'
                    onClick={() => {
                      auth.signOut()
                    }}
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    className='w-100 btnOrange'
                    type='primary'
                    onClick={() => {
                      router.push('/')
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
