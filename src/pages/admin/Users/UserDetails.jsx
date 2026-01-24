import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getUsers, updateUser, deleteUser } from '../../../actions/userActions'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import ConfirmationModal from '../../../components/feedback/ConfirmationModal'
import Loader from '../../../components/feedback/Loader'
import PageWrapper from '../../../components/layout/PageWrapper'
import toast from 'react-hot-toast'

const UserDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { users = [], loading } = useSelector(state => state.user || {})
  const user = users.find(u => u._id === id)

  const [editMode, setEditMode] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    active: true,
  })

  // Load users
  useEffect(() => {
    if (users.length === 0) {
      dispatch(getUsers())
    }
  }, [dispatch, users.length])

  // Initialize form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        active: user.active !== false,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUpdate = async () => {
    if (!user) return
    setUpdating(true)
    try {
      await dispatch(updateUser(user._id, formData))
      toast.success('User updated successfully!')
      setEditMode(false)
      dispatch(getUsers())
    } catch (error) {
      toast.error('Failed to update user')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    try {
      await dispatch(deleteUser(user._id))
      toast.success('User deleted successfully!')
      navigate('/admin/users')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loader message="Loading user details..." />
      </div>
    )
  }

  if (!user) {
    return (
      <PageWrapper
        title="User Not Found"
        description="The requested user could not be found"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-6">👤</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h3>
          <p className="text-gray-600 mb-8">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/admin/users')}>
            ← Back to Users
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <PageWrapper
      title="User Details"
      description={`Manage user: ${user.name}`}
    >
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-emerald-600">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-emerald-100 text-emerald-800'
                      }`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {user.active ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit User'}
              </Button>
            </div>

            {/* Edit Form */}
            {editMode && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Active User</span>
                </label>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Information */}
          {!editMode && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="text-base font-medium text-gray-900">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="text-base font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">User Role</p>
                  <p className="text-base font-medium text-gray-900 capitalize">{user.role}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Account Status</p>
                  <p className="text-base font-medium text-gray-900">
                    {user.active ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-base font-medium text-gray-900">{joinDate}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-base font-medium text-gray-900">{user.totalOrders || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                fullWidth
                variant="outline"
                onClick={() => setEditMode(true)}
              >
                ✏️ Edit User
              </Button>

              <Button
                fullWidth
                variant="outline"
                onClick={() => setConfirmModal({
                  isOpen: true,
                  title: 'Delete User',
                  message: 'This action cannot be undone. The user will be permanently removed from the system.',
                  confirmText: 'Delete User',
                  isDangerous: true,
                  onConfirm: handleDelete
                })}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                🗑️ Delete User
              </Button>
            </div>
          </div>

          {/* User Stats */}
          {user.totalOrders !== undefined && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Stats</h3>

              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{user.totalOrders || 0}</div>
                  <div className="text-sm text-blue-800">Total Orders</div>
                </div>

                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">${(user.totalSpent || 0).toFixed(2)}</div>
                  <div className="text-sm text-emerald-800">Total Spent</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
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
    </PageWrapper>
  )
}

export default UserDetails
