import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const empty = { name: '', sku: '', quantity: 0, price: 0, category: '' }

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isEdit) api.get(`/products/${id}`).then((r) => setForm(r.data))
  }, [id, isEdit])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, form)
      } else {
        await api.post('/products', form)
      }
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">{isEdit ? 'Edit Product' : 'New Product'}</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-lg">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" value={form.name} onChange={set('name')} required />
          <Field label="SKU" value={form.sku} onChange={set('sku')} required />
          <Field label="Category" value={form.category} onChange={set('category')} />
          <Field label="Quantity" type="number" min={0} value={form.quantity} onChange={set('quantity')} required />
          <Field label="Price ($)" type="number" step="0.01" min={0} value={form.price} onChange={set('price')} required />
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => navigate('/products')}
              className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
