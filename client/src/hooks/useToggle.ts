import { useState } from 'react'

export const useToggle = <T extends boolean>(init: boolean = false) => {
  const [isOn, setValue] = useState<T>(init as T)

  const toggle = () => setValue((prev) => !prev as T)

  return [isOn, toggle as () => void] as const
}
