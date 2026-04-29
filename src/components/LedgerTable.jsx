export default function LedgerTable({ entries, loading }) {
  const fmt = (p) => `₹${((p ?? 0) / 100).toFixed(2)}`

  if (loading) {
    return <p className="text-sm text-gray-400 text-center py-8">Loading...</p>
  }

  if (!entries.length) {
    return <p className="text-sm text-gray-400 text-center py-8">No ledger entries.</p>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {entries.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  e.type === 'credit'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {e.type}
                </span>
              </td>
              <td className={`px-4 py-3 font-medium ${e.type === 'credit' ? 'text-green-700' : 'text-red-600'}`}>
                {e.type === 'credit' ? '+' : '-'}{fmt(e.amount)}
              </td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(e.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
