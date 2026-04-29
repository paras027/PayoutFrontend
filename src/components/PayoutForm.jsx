import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import api from '../api'

export default function PayoutForm({ merchantId, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [bankAccount, setBankAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const rupees = Number(amount)
      if(!Number.isInteger(rupees)){
        setError('Amount must be a whole number')
        return;
      }
      await api.post(
        '/payouts/',
        { merchant_id: merchantId, amount: parseInt(amount, 10), bank_account_id: bankAccount },
        { headers: { 'Idempotency-Key': idempotencyKey } }
      )
      setAmount('')
      setBankAccount('')
      setIdempotencyKey(uuidv4()) // new key only after success
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong')
      // key stays the same on failure — retry is safe
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Request Payout</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-sm text-gray-500 block mb-1">Amount (paise)</label>
          <input
            type="number"
            min="1"
            step="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000 for ₹500.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500 block mb-1">Bank Account ID</label>
          <input
            type="text"
            required
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            placeholder="e.g. HDFC001"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
        >
          {loading ? 'Submitting…' : 'Request Payout'}
        </button>
      </form>
    </div>
  )
}
