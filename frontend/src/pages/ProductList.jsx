import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const LIMIT = 10

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchProducts = useCallback(() => {
    setLoading(true)
    api.get('/products', { params: { search, page, limit: LIMIT } })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total) })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const confirmDelete = async () => {
    await api.delete(`/products/${deleteId}`)
    setDeleteId(null)
    fetchProducts()
  }

  const pages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Products</h2>
        <button onClick={() => navigate('/products/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
          + Add Product
        </button>
      </div>
      <input type="text" placeholder="Search products..." value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="mb-4 border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No products found</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                <td className="px-4 py-3 text-gray-500">{p.category || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.quantity <= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                  }`}>{p.quantity}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 space-x-3">
                  <button onClick={() => navigate(`/products/${p.id}/edit`)}
                    className="text-indigo-600 hover:underline text-xs">Edit</button>
                  <button onClick={() => setDeleteId(p.id)}
                    className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-xs text-gray-500">{total} products</span>
            <div className="flex gap-2 items-center">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 border rounded text-xs disabled:opacity-40">Prev</button>
              <span className="text-xs text-gray-600">{page} / {pages}</span>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
                className="px-3 py-1 border rounded text-xs disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-80">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
