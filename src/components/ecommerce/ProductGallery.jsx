import React, { useState, useRef, useEffect } from 'react'
import { getImageUrl } from '../../utils/urlHelpers';

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const containerRef = useRef(null)
  const startYRef = useRef(0)


  // If no images provided, use placeholder
  const productImages = images.length > 0
    ? images
    : [{ image: '/api/placeholder/600/600', _id: '1' }]

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (productImages.length <= 1) return
    setIsDragging(true)
    setStartX(e.clientX)
    startYRef.current = e.clientY
    setCurrentX(e.clientX)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = Math.abs(e.clientY - startYRef.current)

    // Only drag if horizontal movement is more than vertical (not scrolling)
    if (deltaX !== 0 && Math.abs(deltaX) > deltaY) {
      e.preventDefault()
      setCurrentX(e.clientX)
      setDragOffset(deltaX)
    }
  }

  const handleMouseUp = (e) => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaX = e.clientX - startX
    const threshold = 50 // Minimum drag distance to change image

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && selectedImage > 0) {
        // Drag right - go to previous image
        setSelectedImage(selectedImage - 1)
      } else if (deltaX < 0 && selectedImage < productImages.length - 1) {
        // Drag left - go to next image
        setSelectedImage(selectedImage + 1)
      }
    }

    setDragOffset(0)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (productImages.length <= 1) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    startYRef.current = e.touches[0].clientY
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return

    const deltaX = e.touches[0].clientX - startX
    const deltaY = Math.abs(e.touches[0].clientY - startYRef.current)

    // Only drag if horizontal movement is more than vertical
    if (deltaX !== 0 && Math.abs(deltaX) > deltaY) {
      setCurrentX(e.touches[0].clientX)
      setDragOffset(deltaX)
    }
  }

  const handleTouchEnd = (e) => {
    if (!isDragging) return
    setIsDragging(false)

    const deltaX = e.changedTouches[0].clientX - startX
    const threshold = 50 // Minimum swipe distance

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && selectedImage > 0) {
        // Swipe right - go to previous image
        setSelectedImage(selectedImage - 1)
      } else if (deltaX < 0 && selectedImage < productImages.length - 1) {
        // Swipe left - go to next image
        setSelectedImage(selectedImage + 1)
      }
    }

    setDragOffset(0)
  }

  // Attach mouse event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseup', handleMouseUp)
    container.addEventListener('mouseleave', handleMouseUp)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('mouseleave', handleMouseUp)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, startX, selectedImage, productImages.length])

  const goToPrevious = () => {
    if (selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const goToNext = () => {
    if (selectedImage < productImages.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Thumbnails */}
      <div className="lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {productImages.map((img, index) => (
          <button
            key={img._id || index}
            onClick={() => setSelectedImage(index)}
            className={`
              flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg border-2 overflow-hidden
              transition-all duration-200 cursor-pointer
              ${selectedImage === index
                ? 'border-emerald-500 ring-2 ring-emerald-100'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <img
              src={getImageUrl(img.image)}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:order-2 flex-1">
        <div
          ref={containerRef}
          className="relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Image Container with smooth transitions */}
          <div
            className={`relative w-full h-96 lg:h-[500px] transition-transform ${isDragging ? '' : 'transition-transform duration-300'
              }`}
            style={{
              transform: isDragging ? `translateX(${dragOffset}px)` : 'translateX(0)',
            }}
          >
            <img
              src={getImageUrl(productImages[selectedImage]?.image)}
              alt={`Product view ${selectedImage + 1}`}
              className="w-full h-full object-contain select-none pointer-events-none"
              draggable="false"
            />
          </div>

          {/* Navigation Arrows - Show only if multiple images */}
          {productImages.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className={`
                  absolute left-4 top-1/2 -translate-y-1/2 z-10
                  bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full
                  shadow-md transition-all duration-200
                  ${selectedImage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'}
                `}
                disabled={selectedImage === 0}
                title="Previous image (or drag right)"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className={`
                  absolute right-4 top-1/2 -translate-y-1/2 z-10
                  bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full
                  shadow-md transition-all duration-200
                  ${selectedImage === productImages.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'}
                `}
                disabled={selectedImage === productImages.length - 1}
                title="Next image (or drag left)"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4">
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-lg shadow-sm transition-all hover:scale-110">
              <span className="text-lg">🔍</span>
            </button>
          </div>

          {/* Drag hint for desktop */}
          {productImages.length > 1 && !isDragging && (
            <div className="absolute top-2 left-2 hidden md:block">
              <span className="text-xs bg-gray-700 bg-opacity-70 text-white px-2 py-1 rounded pointer-events-none">
                Drag to browse
              </span>
            </div>
          )}
        </div>

        {/* Image Counter / Dots */}
        {productImages.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            <div className="flex gap-1">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200 cursor-pointer
                    ${selectedImage === index
                      ? 'bg-emerald-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                    }
                  `}
                  title={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2 self-center">
              {selectedImage + 1} / {productImages.length}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductGallery