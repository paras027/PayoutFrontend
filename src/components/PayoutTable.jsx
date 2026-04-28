const STATUS_STYLES = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed:  'bg-green-100 text-green-700',
  failed:     'bg-red-100 text-red-700',
}

export default function PayoutTable({ payouts }) {
  const fmt = (p) => `₹${((p ?? 0) / 100).toFixed(2)}`

  if (!payouts.length) {
    return <p className="text-sm text-gray-400 text-center py-8">No payouts yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Bank Account</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {payouts.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-gray-400">#{p.id}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{fmt(p.amount)}</td>
              <td className="px-4 py-3 text-gray-600">{p.bank_account_id || '—'}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400">
                {new Date(p.created_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
