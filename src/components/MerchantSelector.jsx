export default function MerchantSelector({ merchants, selected, onSelect }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-500 font-medium">Merchant:</label>
      <select
        value={selected ?? ''}
        onChange={(e) => onSelect(Number(e.target.value))}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="" disabled>Select a merchant</option>
        {merchants.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </div>
  )
}
