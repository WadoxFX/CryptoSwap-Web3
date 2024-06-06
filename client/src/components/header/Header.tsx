import { useContext, useEffect, useState } from 'react'

import { Store } from '../ContextProvider'

import style from './Header.module.scss'

const Header = () => {
  const [address, setAddress] = useState<string>('')
  const { provider, toggle } = useContext(Store)

  useEffect(() => {
    const onConnect = async () => {
      const signer = await provider?.getSigner()
      const address = await signer?.getAddress()
      setAddress(address ?? '')
    }

    onConnect()
  }, [provider])

  return (
    <header className={style.header}>
      <h1>Swap</h1>

      {address ? (
        <button className={style.open_aside} onClick={toggle}>
          →
        </button>
      ) : (
        <p>Not logged in to MetaMask</p>
      )}
    </header>
  )
}

export default Header
