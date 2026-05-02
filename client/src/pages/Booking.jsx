import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import Navbar from '../components/Navbar'

const CLASSES  = ['Economy', 'Business', 'First']
const PAY_MODES = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Neo-Token']

function Booking() {
  const navigate  = useNavigate()
  const { state } = useLocation()          // { train, selectedClass } from SearchResults
  const prefill   = state || {}

  const [form, setForm] = useState({
    train_code:   prefill.train?.train_code || '',
    class:        prefill.selectedClass     || 'Economy',
    journey_date: '',
    passenger: { name: '', age: '', gender: 'Male' },
    payment:   { mode: 'UPI' },
  })
  const [train,    setTrain]    = useState(prefill.train || null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(null)   // { pnr_no, seat_no, amount }

  const update  = (field, val) => setForm(f => ({ ...f, [field]: val }))
  const updateP = (field, val) => setForm(f => ({ ...f, passenger: { ...f.passenger, [field]: val } }))

  const fare = train?.fares?.[form.class]

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await api.post('/book-ticket', form)
      setSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.')
    } finally { setLoading(false) }
  }

  // ── Confirmation screen ───────────────────────────────────────
  if (success) return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mt-20 max-w-md w-full text-center border border-white/10 rounded-2xl p-10"
        style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-16 h-16 bg-[#00e46b]/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <span className="material-symbols-outlined text-[#00e46b] text-4xl">check_circle</span>
        </motion.div>
        <h2 className="font-display-lg text-2xl mb-2">Ticket Confirmed!</h2>
        <p className="text-[#d4c0d7] mb-8">Your booking has been confirmed via trigger.</p>
        <div className="bg-black/40 rounded-xl p-6 space-y-3 text-left font-data-mono mb-8 relative overflow-hidden">
          {/* Scanning effect */}
          <motion.div 
            className="absolute inset-0 w-full h-[2px] bg-[#00e46b]/50 shadow-[0_0_10px_#00e46b]"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          <div className="flex justify-between"><span className="text-slate-500">PNR No.</span><span className="text-[#ebb2ff] font-bold">#{success.pnr_no}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Seat</span><span>{success.seat_no}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Train</span><span>{success.train_code}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Class</span><span>{success.class}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Date</span><span>{success.journey_date}</span></div>
          <div className="flex justify-between border-t border-white/10 pt-3"><span className="text-slate-500">Amount Paid</span><span className="text-[#00e46b] font-bold">₹{success.amount}</span></div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tickets')}
          className="w-full bg-[#bc13fe] text-white py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
        >
          View My Tickets
        </motion.button>
      </motion.div>
    </div>
  )

  // ── Booking form ──────────────────────────────────────────────
  return (
    <div className="bg-[#050505] text-on-surface font-body-base min-h-screen pb-20">
      <Navbar />
      <main className="max-w-7xl mx-auto pt-32 px-6">
        <h1 className="font-display-lg text-2xl text-white mb-8">Book Your Journey</h1>

        {error && <div className="mb-6 bg-red-900/30 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT: forms */}
            <motion.div 
              className="lg:col-span-8 space-y-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
              }}
            >
              {/* Journey Details */}
              <motion.section 
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="rounded-2xl p-8 border border-white/10"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#ebb2ff]">train</span>
                  <h2 className="font-headline-md text-headline-md text-white uppercase">Journey Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">TRAIN CODE</label>
                    <input value={form.train_code} onChange={e => update('train_code', e.target.value)} required
                      className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono"
                      placeholder="e.g. KR-101" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">JOURNEY DATE</label>
                    <input type="date" value={form.journey_date} onChange={e => update('journey_date', e.target.value)} required
                      className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono" />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">CLASS</label>
                    <div className="grid grid-cols-3 gap-3">
                      {CLASSES.map(cls => (
                        <motion.button key={cls} type="button" onClick={() => update('class', cls)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`py-3 rounded-xl font-label-caps text-sm border transition-all ${form.class === cls ? 'bg-[#bc13fe]/20 border-[#bc13fe] text-[#ebb2ff]' : 'border-[#504254] text-[#d4c0d7] hover:border-[#ebb2ff]'}`}>
                          {cls}
                          {train?.fares?.[cls] && <span className="block text-xs font-data-mono mt-0.5">₹{train.fares[cls]}</span>}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Passenger Details */}
              <motion.section 
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="rounded-2xl p-8 border border-white/10"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#ebb2ff]">person</span>
                  <h2 className="font-headline-md text-headline-md text-white uppercase">Passenger Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">FULL NAME</label>
                    <input value={form.passenger.name} onChange={e => updateP('name', e.target.value)} required
                      className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all"
                      placeholder="Passenger name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">AGE</label>
                    <input type="number" min="1" max="120" value={form.passenger.age} onChange={e => updateP('age', e.target.value)} required
                      className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono"
                      placeholder="28" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-[#d4c0d7] text-xs">GENDER</label>
                    <select value={form.passenger.gender} onChange={e => updateP('gender', e.target.value)}
                      className="bg-[#1c1b1c] border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono">
                      {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
              </motion.section>

              {/* Payment */}
              <motion.section 
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                className="rounded-2xl p-8 border border-white/10"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#e6feff]">payments</span>
                  <h2 className="font-headline-md text-headline-md text-white uppercase">Payment Mode</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {PAY_MODES.map(mode => (
                    <motion.button key={mode} type="button" onClick={() => setForm(f => ({ ...f, payment: { mode } }))}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`py-3 px-2 rounded-xl font-label-caps text-[10px] border transition-all text-center ${form.payment.mode === mode ? 'bg-[#00f4fe]/10 border-[#00f4fe] text-[#00f4fe]' : 'border-[#504254] text-[#d4c0d7] hover:border-[#e6feff]'}`}>
                      {mode}
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            </motion.div>

            {/* RIGHT: summary */}
            <motion.div 
              className="lg:col-span-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <aside className="rounded-2xl p-8 sticky top-32 border border-white/10 text-white shadow-[0_0_30px_rgba(188,19,254,0.05)]"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}>
                <h2 className="font-headline-md text-headline-md uppercase tracking-tight mb-6">Order Summary</h2>
                <div className="space-y-3 font-data-mono mb-6 relative">
                  <div className="flex justify-between text-sm"><span className="text-[#d4c0d7]">Train</span><span>{form.train_code || '—'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#d4c0d7]">Class</span><span>{form.class}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#d4c0d7]">Date</span><span>{form.journey_date || '—'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#d4c0d7]">Passenger</span><span>{form.passenger.name || '—'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#d4c0d7]">Payment</span><span>{form.payment.mode}</span></div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-4 relative z-10">
                    <span className="font-label-caps text-[#d4c0d7] text-xs">TOTAL</span>
                    <span className="text-2xl font-black text-[#ebb2ff]">{fare ? `₹${fare}` : '—'}</span>
                  </div>
                </div>
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#bc13fe] text-white font-headline-md py-5 rounded-2xl uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-60">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</>
                  ) : (
                    <>Confirm & Pay <span className="material-symbols-outlined">bolt</span></>
                  )}
                </motion.button>
                <p className="text-center text-[10px] font-label-caps text-[#d4c0d7]/40 mt-4">
                  BY CONFIRMING YOU AGREE TO VELOCITY RAIL TERMS OF SERVICE.
                </p>
              </aside>
            </motion.div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Booking
