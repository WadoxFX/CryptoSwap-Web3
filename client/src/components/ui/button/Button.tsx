import clsx from 'clsx'
import React, { ComponentProps } from 'react'

import style from './Button.module.scss'

type ButtonVariant = 'text' | 'outlined' | 'contained'
type ButtonSize = 'small' | 'medium' | 'large'
type ButtonRadius = 'rounded' | 'round' | 'defold'

interface ButtonProps extends ComponentProps<'button'> {
  children: React.ReactNode
  variant: ButtonVariant
  size?: ButtonSize
  radius?: ButtonRadius
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  radius,
  loading,
  ...props
}) => (
  <button
    className={clsx(
      style.button,
      style[variant],
      style[size ?? 'small'],
      style[radius ?? 'defold']
    )}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
)
