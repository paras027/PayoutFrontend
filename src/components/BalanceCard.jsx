export default function BalanceCard({ balance, held }) {
  const fmt = (p) => `₹${((p ?? 0) / 100).toFixed(2)}`

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Available Balance</p>
        <p className="text-3xl font-semibold text-gray-900">{fmt(balance - held)}</p>
      </div>
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-1">Held (Pending / Processing)</p>
        <p className="text-3xl font-semibold text-yellow-500">{fmt(held)}</p>
      </div>
    </div>
  )
}
