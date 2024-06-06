import clsx from 'clsx'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'

import { Store } from '../ContextProvider'

import style from './SideBar.module.scss'

const SideBar = () => {
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const { status, provider } = useContext(Store)

  useEffect(() => {
    const getUserData = async () => {
      const signer = await provider?.getSigner()

      if (signer && provider) {
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)

        setBalance(ethers.formatEther(balance))
        setAddress(address)
        setLoading(false)
      }
    }

    getUserData()
  }, [provider])

  const reducedAddress = address.slice(0, 7) + '...' + address.slice(-5)

  return (
    <aside className={clsx(style.aside, style[status ? 'open' : 'close'])}>
      <div className={style.content}>
        {!loading ? (
          <>
            <div className={style.user_info}>
              <div>Address: {reducedAddress}</div>
              <div>Balance: {balance} ETH</div>
            </div>

            <div>Status: {address ? 'Online' : 'Not online'}</div>
          </>
        ) : (
          'Loading...'
        )}
      </div>
    </aside>
  )
}

export default SideBar
