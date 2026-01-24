import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, updateProduct } from '../../../actions/productActions'
import Button from '../../../components/common/Button'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import ConfirmationModal from '../../../components/feedback/ConfirmationModal';
import ProductForm from '../../../components/admin/ProductForm';

const EditProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { product, loading: productLoading, error } = useSelector(state => state.product || {})

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })

  // Load product data
  useEffect(() => {
    if (id) {
      dispatch(getProduct(id))
    }
  }, [id, dispatch])

  if (productLoading) {
    return (
      <div className="p-6">
        <Loader message="Loading product data..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper
        title="Product Not Found"
        description="The product you're trying to edit doesn't exist"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h3>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Back to Products
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <div className="p-6">
      <PageWrapper
        title={`Edit ${product.name}`}
        description="Update product information"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <p className="text-gray-600">
                Product ID: {product._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 rounded-full">
                Last updated: {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <ProductForm mode="edit" product={product} />

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-red-700 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Delete Product',
                      message: 'Are you sure you want to delete this product? This action cannot be undone.',
                      confirmText: 'Delete Product',
                      isDangerous: true,
                      onConfirm: () => {
                        // This would call deleteProduct action
                        toast.error('Delete functionality would be implemented here')
                      }
                    })
                  }}
                >
                  Delete Product
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const isCurrentlyActive = product.isActive !== false; // Default true if undefined
                    setConfirmModal({
                      isOpen: true,
                      title: isCurrentlyActive ? 'Deactivate Product' : 'Activate Product',
                      message: isCurrentlyActive
                        ? 'Are you sure you want to deactivate this product? It will be hidden from the store.'
                        : 'Are you sure you want to activate this product? It will be visible in the store.',
                      confirmText: isCurrentlyActive ? 'Deactivate' : 'Activate',
                      onConfirm: async () => {
                        const productData = new FormData();
                        productData.append('isActive', !isCurrentlyActive);
                        // We need to preserve other fields? updateProduct usually requires full data if using PUT with replacement, but mongoose update might be partial. 
                        // Our updateProduct action sends FormData. 
                        // Wait, productController updateProduct usually updates fields present in body.
                        // Let's check backend updateProduct.
                        // It uses findByIdAndUpdate with req.body.
                        // So partial is fine.

                        await dispatch(updateProduct(product._id, productData));
                        toast.success(`Product ${isCurrentlyActive ? 'deactivated' : 'activated'} successfully`);
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                      }
                    })
                  }}
                >
                  {product.isActive !== false ? 'Deactivate Product' : 'Activate Product'}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </PageWrapper >
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        isDangerous={confirmModal.isDangerous}
      />
    </div >
  )
}

export default EditProduct