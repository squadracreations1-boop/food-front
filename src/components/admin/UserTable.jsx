import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteUser, updateUser } from '../../actions/userActions'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import ConfirmationModal from '../feedback/ConfirmationModal'
import { useState } from 'react'

const UserTable = ({ users = [], loading = false, onRoleUpdate, onDeleteUser, selectedIds = new Set(), onToggleSelect, onToggleSelectAll }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
    onConfirm: () => { }
  })

  const handleRowKeyDown = (e, user) => {
    const row = e.currentTarget
    if (e.key === 'Enter') {
      e.preventDefault()
      navigate(`/admin/user/${user._id}`)
      return
    }
    if (e.key === 'Delete') {
      e.preventDefault()
      if (onDeleteUser) onDeleteUser(user._id)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = row.nextElementSibling
      if (next) next.focus()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = row.previousElementSibling
      if (prev) prev.focus()
      return
    }
  }

  const handleRoleUpdate = async (userId, newRole) => {
    if (onRoleUpdate) return onRoleUpdate(userId, newRole)
    try {
      await dispatch(updateUser(userId, { role: newRole }))
      toast.success('User role updated')
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (onDeleteUser) return onDeleteUser(userId)
    setConfirmModal({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmText: 'Delete User',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await dispatch(deleteUser(userId))
          toast.success('User deleted successfully')
        } catch (error) {
          toast.error('Failed to delete user')
        }
      }
    })
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Admin</span>
      case 'user':
        return <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">User</span>
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{role}</span>
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
        ))}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">👥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
        <p className="text-gray-600">Users will appear here once they register.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="sr-only">Keyboard: use Arrow Up/Down to move rows, Enter to open user, Delete to remove.</div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Users table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all users"
                  checked={users.length > 0 && users.every(u => selectedIds.has(u._id))}
                  onChange={() => onToggleSelectAll && onToggleSelectAll()}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors"
                role="row"
                tabIndex={0}
                onKeyDown={(e) => handleRowKeyDown(e, user)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select user ${user._id}`}
                    checked={selectedIds.has(user._id)}
                    onChange={() => onToggleSelect && onToggleSelect(user._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/user/${user._id}`}>
                      <Button variant="ghost" size="xs">
                        View
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {users.filter(u => u.role === 'admin').length}
              </span> admins
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {users.filter(u => u.role === 'user').length}
              </span> regular users
            </div>
          </div>
        </div>
      </div>

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

export default UserTable