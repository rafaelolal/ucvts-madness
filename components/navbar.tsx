import { useAppContext } from '@/context/state'
import { auth } from '@/firebaseConfig'
import { Spin } from 'antd'
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
        <Link className='navbar-brand' href='/bracket'>
          UCVTS Madness
        </Link>

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
          style={{ width: '70%', maxWidth: '300px' }}
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
                <Link
                  href='/bracket'
                  className={`btn btn-primary w-100  shadow-sm ${
                    router.pathname == '/bracket' ? 'disabled' : ''
                  }`}
                  onClick={() => setIsBracketButtonLoading(true)}
                >
                  {isBracketButtonLoading ? <Spin /> : 'Live Bracket'}
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link
                  href='/picks'
                  className={`btn btn-primary w-100  shadow-sm ${
                    router.pathname == '/picks' ? 'disabled' : ''
                  }`}
                  onClick={() => setIsBetsButtonLoading(true)}
                >
                  {isBetsButtonLoading ? <Spin /> : 'Your Picks'}
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link
                  href='/leaderboard'
                  className={`btn btn-primary w-100  shadow-sm loading ${
                    router.pathname == '/leaderboard' ? 'disabled' : ''
                  }`}
                  onClick={() => setIsLeaderboardButtonLoading(true)}
                >
                  {isLeaderboardButtonLoading ? <Spin /> : 'Leaderboard'}
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                <Link
                  href='/teams'
                  className={`btn btn-primary w-100  shadow-sm loading ${
                    router.pathname == '/teams' ? 'disabled' : ''
                  }`}
                  onClick={() => setIsTeamsButtonLoading(true)}
                >
                  {isTeamsButtonLoading ? <Spin /> : 'Teams'}
                </Link>
              </li>

              <li className='nav-item w-100 px-3 py-2'>
                {isLoading ? (
                  <a className='btn btn-primary  shadow-sm'>
                    <Spin />
                  </a>
                ) : user ? (
                  <a
                    className='btn btn-primary w-100  shadow-sm'
                    onClick={() => {
                      auth.signOut()
                    }}
                  >
                    Sign Out
                  </a>
                ) : (
                  <Link href='/' className='btn btn-primary w-100  shadow-sm'>
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}
