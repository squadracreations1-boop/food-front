/**
 * Validation utilities
 */

import { VALIDATION_PATTERNS } from './constants'

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' }
  }
  
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' }
  }
  
  if (!VALIDATION_PATTERNS.PASSWORD.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, number, and special character',
    }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Name is required' }
  }
  
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' }
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' }
  }
  
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' }
  }
  
  return { isValid: true, message: '' }
}

/**
 * Validate product data
 * @param {Object} product - Product data to validate
 * @returns {Object} Validation result
 */
export const validateProduct = (product) => {
  const errors = {}
  
  if (!product.name?.trim()) {
    errors.name = 'Product name is required'
  } else if (product.name.length > 100) {
    errors.name = 'Product name must be less than 100 characters'
  }
  
  if (!product.description?.trim()) {
    errors.description = 'Description is required'
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Valid price is required'
  }
  
  if (!product.category?.trim()) {
    errors.category = 'Category is required'
  }
  
  if (product.stock === undefined || product.stock < 0) {
    errors.stock = 'Valid stock quantity is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate order data
 * @param {Object} order - Order data to validate
 * @returns {Object} Validation result
 */
export const validateOrder = (order) => {
  const errors = {}
  
  if (!order.shippingAddress?.address?.trim()) {
    errors.shippingAddress = 'Shipping address is required'
  }
  
  if (!order.shippingAddress?.city?.trim()) {
    errors.city = 'City is required'
  }
  
  if (!order.shippingAddress?.zipCode?.trim()) {
    errors.zipCode = 'Zip code is required'
  }
  
  if (!order.paymentMethod?.trim()) {
    errors.paymentMethod = 'Payment method is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validateForm = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach((field) => {
    const value = data[field]
    const rule = rules[field]
    
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = rule.message || `${field} is required`
      return
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`
      return
    }
    
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} must be less than ${rule.maxLength} characters`
      return
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`
      return
    }
    
    if (rule.validate && value) {
      const customValidation = rule.validate(value, data)
      if (customValidation) {
        errors[field] = customValidation
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate credit card
 * @param {Object} card - Card data
 * @returns {Object} Validation result
 */
export const validateCreditCard = (card) => {
  const errors = {}
  
  if (!card.number?.trim()) {
    errors.number = 'Card number is required'
  } else if (!VALIDATION_PATTERNS.CREDIT_CARD.test(card.number.replace(/\s/g, ''))) {
    errors.number = 'Invalid card number'
  }
  
  if (!card.expiry?.trim()) {
    errors.expiry = 'Expiry date is required'
  } else if (!VALIDATION_PATTERNS.EXPIRY_DATE.test(card.expiry)) {
    errors.expiry = 'Invalid expiry date (MM/YY)'
  }
  
  if (!card.cvv?.trim()) {
    errors.cvv = 'CVV is required'
  } else if (!VALIDATION_PATTERNS.CVV.test(card.cvv)) {
    errors.cvv = 'Invalid CVV'
  }
  
  if (!card.name?.trim()) {
    errors.name = 'Card holder name is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}