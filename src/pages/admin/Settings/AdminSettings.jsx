import React, { useState, useEffect } from 'react'
import PageWrapper from '../../../components/layout/PageWrapper'
import { Shield, ShieldAlert, Save, RefreshCcw } from 'lucide-react'
import Button from '../../../components/common/Button'
import api from '../../../utils/api'
import toast from 'react-hot-toast'

const AdminSettings = () => {
    const [settings, setSettings] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const { data } = await api.get('/api/v1/admin/settings')
            setSettings(data.settings)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch settings')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleToggle = async (key, currentValue) => {
        try {
            setSaving(true)
            const newValue = !currentValue
            await api.put('/api/v1/admin/settings', { key, value: newValue })
            
            // Update local state
            setSettings(prev => prev.map(s => 
                s.key === key ? { ...s, value: newValue } : s
            ))
            
            toast.success(`Setting updated successfully`)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update setting')
        } finally {
            setSaving(false)
        }
    }

    const rateLimitSetting = settings.find(s => s.key === 'isRateLimitEnabled')

    return (
        <PageWrapper title="System Settings" description="Manage platform security and performance">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Security Section */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Security & Anti-Spam</h3>
                                    <p className="text-sm text-gray-500">Enable or disable API protection layers</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={fetchSettings}
                                disabled={loading}
                            >
                                <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        <div className="p-6 space-y-6">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">Rate Limiting</span>
                                            {rateLimitSetting?.value ? (
                                                <span className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded font-bold uppercase tracking-wider">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded font-bold uppercase tracking-wider">Disabled</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Limits each IP address to 100 requests per 15 minutes to prevent DDoS and spam.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Toggle Switch */}
                                        <button
                                            disabled={saving}
                                            onClick={() => handleToggle('isRateLimitEnabled', rateLimitSetting?.value)}
                                            className={`
                                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-transparent focus:ring-emerald-500 focus:ring-offset-2
                                                ${rateLimitSetting?.value ? 'bg-emerald-500' : 'bg-gray-300'}
                                                ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            `}
                                        >
                                            <span
                                                className={`
                                                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                    ${rateLimitSetting?.value ? 'translate-x-6' : 'translate-x-1'}
                                                `}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div className="text-xs text-amber-800 leading-relaxed">
                                    <p className="font-bold mb-1 uppercase tracking-wider">Important Note</p>
                                    Disabling rate limiting can improve checkout speed for some users but removes protection against automated scripts. Use with caution during high-traffic events.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Developer Info */}
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            System Configuration v1.0 • Maitreyi Foods Control Panel
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default AdminSettings
