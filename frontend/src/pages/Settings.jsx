import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Settings() {
  const [form, setForm] = useState({ name: '', lowStockThreshold: 10 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/settings').then((r) => setForm(r.data)).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await api.put('/settings', form)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <p className="text-gray-400">Loading...</p>

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">Settings</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        {saved && <p className="text-green-600 text-sm mb-4">Settings saved.</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
            <input type="number" min={0} value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <p className="text-xs text-gray-400 mt-1">
              Products at or below this quantity show as low stock.
            </p>
          </div>
          <button type="submit" disabled={saving}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
