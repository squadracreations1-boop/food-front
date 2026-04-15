/**
 * Shared utility for calculating shipping costs.
 * 
 * @param {Array} items - List of cart items
 * @param {Number} subtotal - The cart subtotal
 * @returns {Object} - Contains 'actual' (what to charge) and 'base' (what it would cost without discounts)
 */
export const calculateShippingCost = (items, subtotal) => {
  // Base tiered logic
  let baseShipping = 0;
  if (subtotal >= 1500) baseShipping = 120;
  else if (subtotal >= 1000) baseShipping = 100;
  else if (subtotal >= 500) baseShipping = 90;
  else if (subtotal >= 100) baseShipping = 80;
  else baseShipping = 0;

  // Free shipping if any item is featured (checked robustly across all potential structures)
  const hasFeatured = items && items.some(item => {
    const isFeaturedFlag = (
      item.isFeatured === true || 
      item.isFeatured === 'true' || 
      item.product?.isFeatured === true || 
      item.product?.isFeatured === 'true' ||
      item.featured === true ||
      item.is_featured === true
    );

    // Guaranteed fallback by product name for 'Nature's Power Pack' bundle
    const isPowerPackFallback = item.name?.toLowerCase().includes("nature's power pack");

    return isFeaturedFlag || isPowerPackFallback;
  });
  
  return {
    actual: hasFeatured ? 0 : baseShipping,
    base: baseShipping,
    isFree: hasFeatured
  };
};
