import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  required = false,
  className = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
            placeholder:text-gray-400
            ${leftIcon ? 'pl-10' : ''}
            ${(rightIcon || (isPassword && showPasswordToggle)) ? 'pr-10' : ''}
            ${error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
            }
            ${className}
          `}
          {...props}
        />

        {isPassword && showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
          >
            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
          </button>
        ) : rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input