import { Context, createContext, useContext, useEffect, useState } from 'react'
import { notification } from 'antd'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebaseConfig'

type ContextType = {
  user: User | null
  notify: any // TODO: import NotificationInstance
  isLoading: boolean
}

let AppContext: Context<ContextType>

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notify, contextHolder] = notification.useNotification()

  const sharedState = {
    user,
    notify,
    isLoading,
  }

  AppContext = createContext(sharedState)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })
  }, [])

  return (
    <>
      <AppContext.Provider value={sharedState}>
        {contextHolder}
        {children}
      </AppContext.Provider>
    </>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
