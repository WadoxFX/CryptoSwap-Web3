import React, { createContext, useState, ReactNode } from 'react'
import { useToggle } from '../hooks/useToggle'
import type { BrowserProvider } from 'ethers'

interface StoreContextType {
  status: boolean
  provider: BrowserProvider | null
  toggle: () => void
  setProvider: (provider: BrowserProvider | null) => void
}

export const Store = createContext<StoreContextType>({
  status: false,
  provider: null,
  toggle: () => {},
  setProvider: () => {},
})

const ContextProvider: React.FC<Children> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [status, toggle] = useToggle(false)

  return (
    <Store.Provider value={{ status, provider, toggle, setProvider }}>
      {children}
    </Store.Provider>
  )
}

export default ContextProvider
