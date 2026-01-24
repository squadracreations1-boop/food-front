/**
 * Data formatting utilities
 */

/**
 * Format product price with discount
 * @param {Object} product - Product object
 * @returns {Object} Formatted price object
 */
export const formatProductPrice = (product) => {
  const price = product.price || 0
  const originalPrice = product.originalPrice || price
  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
  
  return {
    price: parseFloat(price.toFixed(2)),
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    discount,
    formattedPrice: `$${price.toFixed(2)}`,
    formattedOriginalPrice: originalPrice > price ? `$${originalPrice.toFixed(2)}` : null,
    discountText: discount > 0 ? `Save ${discount}%` : null,
  }
}

/**
 * Format order status with color
 * @param {string} status - Order status
 * @returns {Object} Formatted status object
 */
export const formatOrderStatus = (status) => {
  const statusConfig = {
    Pending: {
      color: 'yellow',
      icon: '⏳',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
    },
    Processing: {
      color: 'blue',
      icon: '⚙️',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
    },
    Shipped: {
      color: 'purple',
      icon: '🚚',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    Delivered: {
      color: 'emerald',
      icon: '✅',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
    Cancelled: {
      color: 'red',
      icon: '❌',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
    },
  }
  
  const config = statusConfig[status] || {
    color: 'gray',
    icon: '📝',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  }
  
  return {
    ...config,
    label: status,
  }
}

/**
 * Format user role with badge
 * @param {string} role - User role
 * @returns {Object} Formatted role object
 */
export const formatUserRole = (role) => {
  const roleConfig = {
    admin: {
      label: 'Admin',
      color: 'purple',
      icon: '👑',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
    },
    user: {
      label: 'User',
      color: 'emerald',
      icon: '👤',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
  }
  
  const config = roleConfig[role] || {
    label: role,
    color: 'gray',
    icon: '❓',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  }
  
  return {
    ...config,
    value: role,
  }
}

/**
 * Format date range for display
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const formatOptions = { month: 'short', day: 'numeric' }
  
  if (start.getFullYear() !== end.getFullYear()) {
    formatOptions.year = 'numeric'
  }
  
  const startStr = start.toLocaleDateString('en-US', formatOptions)
  const endStr = end.toLocaleDateString('en-US', formatOptions)
  
  return `${startStr} - ${endStr}`
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format rating stars
 * @param {number} rating - Rating value (0-5)
 * @param {number} totalStars - Total stars to display
 * @returns {Array} Array of star icons
 */
export const formatRatingStars = (rating, totalStars = 5) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0)
  
  return [
    ...Array(fullStars).fill('★'),
    ...(hasHalfStar ? ['½'] : []),
    ...Array(emptyStars).fill('☆'),
  ]
}

/**
 * Format phone number
 * @param {string} phone - Phone number string
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`
  }
  
  return phone
}