import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUsers, deleteUser, updateUser } from '../../../actions/userActions'
import Pagination from '../../../components/common/Pagination'
import { useDebounce } from '../../../hooks/useDebounce'
import toast from 'react-hot-toast'
import UserTable from '../../../components/admin/UserTable'
import { EmptyState } from '../../../components/feedback/EmptyState'
import Loader from '../../../components/feedback/Loader'
import Button from '../../../components/common/Button'
import Input from '../../../components/common/Input'
import Modal from '../../../components/common/Model'
import PageWrapper from '../../../components/layout/PageWrapper'
import ConfirmationModal from '../../../components/feedback/ConfirmationModal'
import { PlusIcon, LoaderIcon, Truck, CheckCircle2, XCircle, TrendingUp, BarChart3, PackageCheck, Clock, Boxes, RefreshCcw, Eye, Trash2, UserCircle2 } from 'lucide-react'

// import { useModal } from '../../../hooks/useModal'

const AdminUsers = () => {
  const dispatch = useDispatch()
  const { users = [], loading } = useSelector(state => state.user || {})

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 400)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
  })
  const [creatingUser, setCreatingUser] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })
  // Selection & bulk actions
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [bulkAction, setBulkAction] = useState('')

  const onToggleSelect = (id) => {
    setSelectedUsers(prev => {
      const s = new Set(prev)
      if (s.has(id)) s.delete(id)
      else s.add(id)
      return s
    })
  }

  const onToggleSelectAll = () => {
    const pageIds = paginatedUsers.map(u => u._id)
    const allSelected = pageIds.every(id => selectedUsers.has(id))
    setSelectedUsers(prev => {
      const s = new Set(prev)
      if (allSelected) pageIds.forEach(id => s.delete(id))
      else pageIds.forEach(id => s.add(id))
      return s
    })
  }

  // Load users
  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  // Apply filters
  useEffect(() => {
    let result = users

    // Search filter (debounced)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(user =>
        (user.name || '').toLowerCase().includes(q) ||
        (user.email || '').toLowerCase().includes(q) ||
        (user.phone || '').toLowerCase().includes(q)
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(user =>
        statusFilter === 'active' ? user.active === true : user.active === false
      )
    }

    setFilteredUsers(result)
    setCurrentPage(1)
  }, [users, debouncedSearch, roleFilter, statusFilter])

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAddUser = async (e) => {
    e.preventDefault()

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (newUser.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    try {
      setCreatingUser(true)
      // Call API to create user - adjust based on your backend route
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          phone: newUser.phone,
          role: newUser.role
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create user')
      }

      toast.success('User created successfully!')
      setShowAddUserModal(false)
      setNewUser({ name: '', email: '', password: '', role: 'user', phone: '' })

      // Refresh users list
      dispatch(getUsers())
    } catch (error) {
      toast.error(error.message || 'Failed to create user')
      console.error('User creation error:', error)
    } finally {
      setCreatingUser(false)
    }
  }

  const handleDeleteUser = (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'This action cannot be undone. The user will be removed from the system.',
      confirmText: 'Delete User',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await dispatch(deleteUser(userId))
          toast.success('User deleted successfully')
          dispatch(getUsers())
        } catch (error) {
          toast.error('Failed to delete user')
        }
      }
    })
  }

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      // dispatch(updateUser(userId, { role: newRole })) → provided externally
      await dispatch(updateUser(userId, { role: newRole }))
      toast.success('User role updated')
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  // Calculate statistics
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const activeUsers = users.filter(u => u.active !== false).length
  const newUsersThisMonth = users.filter(u => {
    const userDate = new Date(u.createdAt)
    const now = new Date()
    return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
  }).length

  if (loading) {
    return (
      <div className="p-6">
        <Loader message="Loading users..." />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export users functionality
                toast.info('Export feature coming soon')
              }}
            >
              Export Users
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddUserModal(true)}
            >
              <span className="mr-2"><PlusIcon size={20} strokeWidth={1.5} color='white' /></span>
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                {totalUsers}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><UserCircle2 size={20} strokeWidth={1.5} color='green' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {adminUsers}
              </div>
              <div className="text-sm text-gray-600">Admin Users</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><UserCircle2 size={20} strokeWidth={1.5} color='purple' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {activeUsers}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><CheckCircle2 size={20} strokeWidth={1.5} color='blue' /></span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-amber-600">
                {newUsersThisMonth}
              </div>
              <div className="text-sm text-gray-600">New This Month</div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl"><TrendingUp size={20} strokeWidth={1.5} color='orange' /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role Filter
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 hover:text-emerald-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {roleFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Role: {roleFilter}
                    <button
                      onClick={() => setRoleFilter('all')}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('all')
                  setStatusFilter('all')
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No Users Found"
          message="No users match your current filters"
          icon="👥"
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('')
            setRoleFilter('all')
            setStatusFilter('all')
          }}
        />
      ) : (
        <>
          <UserTable
            users={paginatedUsers}
            loading={loading}
            onRoleUpdate={handleRoleUpdate}
            onDeleteUser={handleDeleteUser}
            selectedIds={selectedUsers}
            onToggleSelect={onToggleSelect}
            onToggleSelectAll={onToggleSelectAll}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
              />
            </div>
          )}
        </>
      )}

      {/* User Summary */}
      {filteredUsers.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Summary</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {filteredUsers.length}
              </div>
              <div className="text-sm text-emerald-800">Filtered Users</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredUsers.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-sm text-blue-800">Admins</div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {filteredUsers.filter(u => u.active !== false).length}
              </div>
              <div className="text-sm text-amber-800">Active</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Date().toLocaleDateString('default', { month: 'short' })}
              </div>
              <div className="text-sm text-purple-800">Current Month</div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {filteredUsers.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Actions</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                <option value="">Select Action</option>
                <option value="make_admin">Make Admin</option>
                <option value="make_user">Make Regular User</option>
                <option value="activate">Activate Users</option>
                <option value="deactivate">Deactivate Users</option>
                <option value="delete">Delete Selected</option>
                <option value="export">Export Selected</option>
              </select>
              <Button variant="outline" onClick={async () => {
                if (!bulkAction) { toast.error('Select an action'); return }
                const ids = [...selectedUsers]
                if (ids.length === 0) { toast.error('No users selected'); return }
                if (bulkAction === 'export') { toast('Export not implemented'); return }

                const performAction = async () => {
                  try {
                    if (bulkAction === 'delete') {
                      await Promise.all(ids.map(id => dispatch(deleteUser(id))))
                    } else if (bulkAction === 'make_admin' || bulkAction === 'make_user') {
                      const role = bulkAction === 'make_admin' ? 'admin' : 'user'
                      await Promise.all(ids.map(id => dispatch(updateUser(id, { role }))))
                    } else if (bulkAction === 'activate' || bulkAction === 'deactivate') {
                      const active = bulkAction === 'activate'
                      await Promise.all(ids.map(id => dispatch(updateUser(id, { active }))))
                    }
                    toast.success('Bulk action completed')
                    setSelectedUsers(new Set())
                    dispatch(getUsers())
                  } catch (err) {
                    toast.error('Failed to apply bulk action')
                  }
                }

                if (bulkAction === 'delete') {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Delete Selected Users',
                    message: `Are you sure you want to delete ${ids.length} users? This action cannot be undone.`,
                    confirmText: `Delete ${ids.length} Users`,
                    isDangerous: true,
                    onConfirm: performAction
                  })
                } else {
                  performAction()
                }
              }}>
                Apply to Selected
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
        size="md"
      >
        <form onSubmit={handleAddUser} className="space-y-6">
          <Input
            label="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            placeholder="John Doe"
          />

          <Input
            label="Email Address"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            placeholder="user@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
            placeholder="Create a password"
            helperText="At least 8 characters"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <Input
              label="Phone Number"
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              fullWidth
              disabled={creatingUser}
            >
              {creatingUser ? 'Creating...' : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowAddUserModal(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> An email with account details will be sent to the user.
            </p>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation modal */}
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
    </div>
  )
}



export default AdminUsers