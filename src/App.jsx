import { useEffect, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import api from './api'
import BalanceCard from './components/BalanceCard'
import PayoutForm from './components/PayoutForm'
import PayoutTable from './components/PayoutTable'
import LedgerTable from './components/LedgerTable'
import MerchantSelector from './components/MerchantSelector'

export default function App() {
  const [merchants, setMerchants] = useState([])
  const [selectedMerchant, setSelectedMerchant] = useState(null)
  const [ledger, setLedger] = useState([])
  const [payouts, setPayouts] = useState([])
  const [tab, setTab] = useState('payouts')

  // derived balance figures
  const balance = ledger.reduce((acc, e) => acc + (e.type === 'credit' ? e.amount : -e.amount), 0)
  const held = payouts
    .filter((p) => p.status === 'pending' || p.status === 'processing')
    .reduce((acc, p) => acc + p.amount, 0)

  // load merchants once, then auto-select first and immediately fetch their data
  useEffect(() => {
    api.get('/merchants/user/').then((r) => {
      setMerchants(r.data)
      if (r.data.length) {
        const firstId = r.data[0].id
        setSelectedMerchant(firstId)
        // fetch immediately with the id we just got — don't wait for state update
        api.get(`/ledger/details/?merchant=${firstId}`).then((res) => setLedger(res.data))
        api.get(`/payouts/?merchant=${firstId}`).then((res) => setPayouts(res.data))
      }
    })
  }, [])

  const fetchData = useCallback(() => {
    if (!selectedMerchant) return
    api.get(`/ledger/details/?merchant=${selectedMerchant}`).then((r) => setLedger(r.data))
    api.get(`/payouts/?merchant=${selectedMerchant}`).then((r) => setPayouts(r.data))
  }, [selectedMerchant])

  // poll every 5s after initial load
  useEffect(() => {
    if (!selectedMerchant) return
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [fetchData, selectedMerchant])

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">Playto</span>
          <span className="text-xl font-semibold text-gray-700">Pay</span>
        </div>
        <MerchantSelector
          merchants={merchants}
          selected={selectedMerchant}
          onSelect={(id) => setSelectedMerchant(id)}
        />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Balance */}
        <BalanceCard balance={balance} held={held} />

        <div className="grid grid-cols-3 gap-6">
          {/* Payout form */}
          <div className="col-span-1">
            <PayoutForm merchantId={selectedMerchant} onSuccess={fetchData} />
          </div>

          {/* Tables */}
          <div className="col-span-2 flex flex-col gap-4">
            {/* Tab switcher */}
            <div className="flex gap-2">
              {['payouts', 'ledger'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    tab === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <span className="ml-auto text-xs text-gray-400 self-center">Live · refreshes every 5s</span>
            </div>

            {tab === 'payouts'
              ? <PayoutTable payouts={payouts} />
              : <LedgerTable entries={ledger} />
            }
          </div>
        </div>
      </main>
    </div>
  )
}
