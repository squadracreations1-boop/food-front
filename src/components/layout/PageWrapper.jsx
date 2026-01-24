function PageWrapper({ children, title, description, className = '' }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      {(title || description) && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="container">
            <div className="py-8 md:py-12">
              {title && (
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-emerald-100 text-lg max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="container">
        <div className={`py-8 ${className}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageWrapper