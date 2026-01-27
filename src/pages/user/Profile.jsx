import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { updateProfile, updatePassword } from '../../actions/userActions'
import Sidebar from '../../components/layout/Sidebar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Model'
import Loader from '../../components/feedback/Loader'
import PageWrapper from '../../components/layout/PageWrapper'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import { Camera, MapPin, Shield, User, Mail, Phone, Globe, Save, Upload } from 'lucide-react'
import { getImageUrl } from '../../utils/urlHelpers';

const Profile = () => {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const { user, loading: authLoading } = useSelector(state => state.auth)
  const { updateProfile: updateProfileAction, updatePassword: updatePasswordAction } = useAuth()

  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  })

  // Avatar State
  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'India',
      })
      if (user.avatar) {
        // If avatar is a URL/path, use getImageUrl to resolve it, otherwise keep it if it's base64 (which shouldn't happen from DB usually but good safety)
        setAvatarPreview(getImageUrl(user.avatar))
      }
    }
  }, [user])

  const handleAvatarChange = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result)
        setAvatar(reader.result) // Store as base64 or file? The controller expects file upload or base64? 
        // The controller checks `req.file` which implies Multipart Form Data. 
        // But the previous implementation might have been setting up for simple JSON or Multipart.
        // Actually, the controller logic `if (req.file)` works with multer. 
        // We need to set the file object to state to send it.
      }
    }
    // We also need the file object itself for FormData if using multer
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]) // Store file object
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)

    try {
      const profileData = new FormData()
      Object.keys(profileForm).forEach(key => {
        profileData.append(key, profileForm[key])
      })

      if (avatar && typeof avatar !== 'string') {
        // It's a file
        profileData.append('avatar', avatar)
      } else if (avatar && typeof avatar === 'string' && avatar.startsWith('data:')) {
        // It's a base64 string (if we supported that, but backend expects req.file for avatar usually)
        // Check backend: "if (req.file) { avatar = ... }"
        // So we must send as File object in FormData
      }

      await updateProfileAction(profileData)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update profile')
    } finally {
      setUpdatingProfile(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setUpdatingPassword(true)

    try {
      await updatePasswordAction({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password updated successfully!')
      setShowPasswordModal(false)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container py-12">
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <PageWrapper title="My Account" description="Manage your profile and preferences">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl pointer-events-none"></div>

              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                    <img
                      src={avatarPreview || getImageUrl(user?.avatar) || '/images/default_avatar.png'}
                      alt={user?.name}
                      onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + (user?.name || 'User') + "&background=10b981&color=fff"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-1 right-1 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-600 transition-colors">
                    <Camera size={14} />
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.name}</h1>
                  <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                    <Mail size={14} /> {user?.email}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                      {user?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                    </span>
                    <span className="text-xs text-gray-400">
                      Member since {new Date(user?.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordModal(true)}
                    className="whitespace-nowrap"
                  >
                    <Shield size={16} className="mr-2" /> Security
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User size={20} className="text-emerald-500" /> Personal Information
                  </h3>
                </div>

                <div className="p-8">
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <Input
                        label="Full Name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                        placeholder="Your full name"
                        icon={<User size={18} />}
                      />

                      <Input
                        label="Email Address"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        required
                        disabled
                        helperText="Email cannot be changed"
                        icon={<Mail size={18} />}
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        icon={<Phone size={18} />}
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          loading={updatingProfile}
                          disabled={updatingProfile}
                          className="px-8"
                        >
                          <Save size={18} className="mr-2" /> Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Address Book Tab */}
            {(activeTab === 'address' || activeTab === 'addresses') && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-emerald-500" /> Shipping Address
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Primary</span>
                </div>

                <div className="p-8">
                  <p className="text-gray-500 mb-6 text-sm">
                    This address will be used as your default shipping address for checkout.
                  </p>

                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid md:grid-cols-1 gap-6">
                      <Input
                        label="Street Address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="Flat No, Building, Street, Area"
                        icon={<MapPin size={18} />}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                      <Input
                        label="City"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        placeholder="City"
                      />

                      <Input
                        label="State"
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        placeholder="State"
                      />

                      <Input
                        label="Zip Code"
                        value={profileForm.zipCode}
                        onChange={(e) => setProfileForm({ ...profileForm, zipCode: e.target.value })}
                        placeholder="Pin Code"
                      />

                      <Input
                        label="Country"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        placeholder="Country"
                        icon={<Globe size={18} />}
                      />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          loading={updatingProfile}
                          disabled={updatingProfile}
                          className="px-8"
                        >
                          <Save size={18} className="mr-2" /> Save Address
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Wishlist Placeholder (Linking to dedicated page is better, but showing list here is fine too) */}
            {(activeTab === 'wishlist') && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-gray-900">Your Wishlist</h3>
                <p className="text-gray-500 mt-2 mb-6">View and manage items you've saved for later.</p>
                <Button onClick={() => window.location.href = '/profile/wishlist'}>Go to Wishlist</Button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Shield size={20} className="text-emerald-500" /> Account Security
                  </h3>
                </div>
                <div className="p-8">
                  <div className="space-y-6 max-w-2xl">
                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                      <h4 className="font-bold text-orange-900 mb-2">Change Password</h4>
                      <p className="text-sm text-orange-800/80 mb-4">
                        It's a good idea to use a strong password that you're not using elsewhere.
                      </p>
                      <Button variant="outline" onClick={() => setShowPasswordModal(true)} className="bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                        Update Password
                      </Button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Add an extra layer of security to your account by enabling 2FA.
                      </p>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
              placeholder="Enter your current password"
              showPasswordToggle={true}
            />

            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              placeholder="Create a new password"
              showPasswordToggle={true}
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              placeholder="Confirm your new password"
              showPasswordToggle={true}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                loading={updatingPassword}
                disabled={updatingPassword}
                fullWidth
              >
                Update Password
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </PageWrapper>
    </div>
  )
}

export default Profile