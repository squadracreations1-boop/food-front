import React from 'react'
import ProductForm from '../../../components/admin/ProductForm'
import PageWrapper from '../../../components/layout/PageWrapper'

const AddProduct = () => {
  return (
    <div className="p-6">
      <PageWrapper 
        title="Add New Product" 
        description="Create a new organic product listing"
      >
        <ProductForm mode="create" />
      </PageWrapper>
    </div>
  )
}

export default AddProduct