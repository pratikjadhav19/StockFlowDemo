import { useEffect, useState } from 'react'
import api from '../api/axios'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then((r) => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-400">Loading...</p>
  if (!data) return <p className="text-red-500">Failed to load dashboard.</p>

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-5">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Products" value={data.totalProducts} />
        <StatCard label="Low Stock Items" value={data.lowStockCount} sub={`Threshold: ≤ ${data.threshold}`} />
        <StatCard label="Inventory Value" value={`$${data.inventoryValue.toFixed(2)}`} />
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-700">Low Stock Products</h3>
        </div>
        {data.lowStockProducts.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No low stock items.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Name</th>
                <th className="px-4 py-2 font-medium">SKU</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Qty</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStockProducts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-2 text-gray-500">{p.sku}</td>
                  <td className="px-4 py-2 text-gray-500">{p.category || '-'}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-medium">
                      {p.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
