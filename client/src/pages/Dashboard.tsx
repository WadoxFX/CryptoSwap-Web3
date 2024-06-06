import { useContext, useEffect, useState } from 'react'
import { BrowserProvider, Contract, ethers, JsonRpcSigner } from 'ethers'
import { useForm } from 'react-hook-form'

import { Button } from '../components/ui'
import { ExchangeArrowIcon } from '../components/icons'
import { Store } from '../components/ContextProvider'
import data from '../lib/contractInfo.json'

import style from '../styles/Dashboard.module.scss'

const Dashboard = () => {
  const { setProvider } = useContext(Store)

  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)
  const [balance, setBalance] = useState<BalanceCurrencies>({ eth: 0, weth: 0 })
  const [message, setMessage] = useState<string>('')
  const [exchangeState, setExchangeState] = useState<ExchangeState>({
    from: 'eth',
    to: 'weth',
  })

  const { register, watch } = useForm<FormValues>()
  const fromBalance = balance[exchangeState.from as keyof typeof balance]

  useEffect(() => {
    if (contract && signer) {
      getWETHBalance()
      getETHBalance()
    }
  }, [contract])

  const onConnectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const { ethereum } = window

        const provider = new ethers.BrowserProvider(ethereum)
        await ethereum.request({ method: 'eth_requestAccounts' })
        setProvider(provider)

        const signer = await provider.getSigner()
        setSigner(signer)

        await getContract(signer)
        await getETHBalance(provider, signer)
      } catch (error: any) {
        setMessage(error.message)
      }
    }
  }

  // Contract functions
  const deposit = async () => {
    if (contract && fromBalance > watch('from')) {
      try {
        const txDeposut = ethers.parseEther(String(watch('from')))
        await contract.deposit({ value: txDeposut })

        await getWETHBalance()
      } catch (error: unknown) {
        setMessage('An error occurred during the request')
      }
    }
  }

  const withdraw = async () => {
    if (contract) {
      try {
        const txWithdraw = ethers.parseEther(String(watch('from')))
        await contract.withdraw(txWithdraw)
      } catch (error: unknown) {
        setMessage('An error occurred during the request')
      }
    }
  }

  const getWETHBalance = async () => {
    if (contract) {
      const balance = await contract.balanceOf(signer?.address)
      const weth = +ethers.formatEther(balance)
      setBalance((prev) => ({ ...prev, weth }))
    }
  }
  // ====================

  const getContract = async (signer: JsonRpcSigner) => {
    const contract = new ethers.Contract(data.address, data.abi, signer)
    setContract(contract)
  }

  const onChangeOrder = () => {
    setExchangeState({
      from: exchangeState.to,
      to: exchangeState.from,
    })
  }

  const getETHBalance = async (
    provider?: BrowserProvider,
    signer?: JsonRpcSigner
  ) => {
    if (provider && signer?.address) {
      const balance = await provider.getBalance(signer.address)
      const eth = +ethers.formatEther(balance)
      setBalance((prev) => ({ ...prev, eth }))
    }
  }

  const drawBalance = (type: 'from' | 'to', toFixedCount?: number): string => {
    return balance[exchangeState[type] as keyof typeof balance].toFixed(
      toFixedCount ?? undefined
    )
  }

  const isFormValid = () => {
    const fromValue = watch('from')
    return fromValue == undefined || fromValue < +fromBalance || !signer?.address
  }

  return (
    <div className={style.container}>
      <form>
        <div className={style.inputs}>
          <div className={style.change_order_container}>
            <button
              type="button"
              onClick={onChangeOrder}
              className={style.change_order_button}
            >
              <ExchangeArrowIcon />
            </button>
          </div>

          <div className={style.input_container}>
            <input
              type="number"
              placeholder="0"
              min="0"
              {...register('from', {
                required: 'This field is required',
                pattern: {
                  value: /^\d+$/,
                  message: 'Only numbers are allowed',
                },
              })}
            />
            <div className={style.currency}>{exchangeState.from}</div>
            <div className={style.balance}>
              Balance: {drawBalance('from', 3)} Max
            </div>
          </div>
          <div className={style.input_container}>
            <input disabled placeholder="0" defaultValue={watch('from')} />
            <div className={style.currency}>{exchangeState.to}</div>
            <div className={style.balance}>Balance: {drawBalance('to', 3)}</div>
          </div>
        </div>

        {message && <p>{message}</p>}

        <Button
          onClick={
            !signer
              ? onConnectToMetaMask
              : exchangeState.from === 'eth' ? deposit : withdraw
          }
          variant={signer ? 'contained' : 'outlined'}
          type="button"
          radius="rounded"
          size="large"
          disabled={!isFormValid()}
        >
          {signer
            ? exchangeState.from === 'eth' ? 'Wrap' : 'Unwrap'
            : 'Connect To MetaMask'}
        </Button>
      </form>
    </div>
  )
}

export default Dashboard
