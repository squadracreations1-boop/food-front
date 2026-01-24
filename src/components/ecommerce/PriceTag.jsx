import React from 'react'

const PriceTag = ({ 
  price=0, 
  originalPrice, 
  size = 'sm', 
  showDiscount = true,
  showTax = false,
  className = ''
}) => {
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const sizes = {
    sm: {
      price: 'text-lg',
      original: 'text-sm',
      discount: 'text-xs',
      tax: 'text-xs'
    },
    md: {
      price: 'text-2xl',
      original: 'text-base',
      discount: 'text-sm',
      tax: 'text-sm'
    },
    lg: {
      price: 'text-3xl',
      original: 'text-lg',
      discount: 'text-base',
      tax: 'text-base'
    },
    xl: {
      price: 'text-4xl',
      original: 'text-xl',
      discount: 'text-lg',
      tax: 'text-lg'
    }
  }

  const sizeClasses = sizes[size]

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClasses.price} font-bold text-gray-900`}>
          ₹{price.toFixed(2)}
        </span>
        
        {originalPrice && originalPrice > price && (
          <>
            <span className={`${sizeClasses.original} text-gray-500 line-through`}>
              ₹{originalPrice.toFixed(2)}
            </span>
            
            {showDiscount && discount > 0 && (
              <span className={`${sizeClasses.discount} bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded`}>
                Save {discount}%
              </span>
            )}
          </>
        )}
      </div>

      {showTax && (
        <p className={`${sizeClasses.tax} text-gray-600`}>
          + ₹{(price * 0.08).toFixed(2)} estimated tax
        </p>
      )}

      {/* Payment Options */}
      <div className="flex items-center gap-2 text-gray-600">
        <span className="text-sm">or</span>
        <span className="font-medium">
          ₹{((price / 4) + (price * 0.08)).toFixed(2)}/mo for 4 months
        </span>
      </div>
    </div>
  )
}

// Specialized price tags
export const InlinePriceTag = ({ price, originalPrice, className = '' }) => (
  <div className={`inline-flex items-baseline gap-2 ${className}`}>
    <span className="font-bold text-gray-900">₹{price.toFixed(2)}</span>
    {originalPrice && originalPrice > price && (
      <span className="text-sm text-gray-500 line-through">
        ₹{originalPrice.toFixed(2)}
      </span>
    )}
  </div>
)

export const MiniPriceTag = ({ price, className = '' }) => (
  <div className={`inline-flex items-center ${className}`}>
    <span className="text-lg font-bold text-emerald-600">₹{price.toFixed(2)}</span>
    <span className="text-xs text-gray-500 ml-1">ea</span>
  </div>
)

export default PriceTag