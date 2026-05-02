import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function AdminDashboard() {
  const [stats,    setStats]    = useState(null)
  const [bookings, setBookings] = useState([])
  const [trains,   setTrains]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('overview')    // overview | bookings | trains

  // New-train form state
  const [trainForm, setTrainForm] = useState({ train_code:'', train_name:'', source:'', destination:'', departure_time:'', arrival_time:'', total_seats:100, fares:[{class:'Economy',fare:''},{class:'Business',fare:''},{class:'First',fare:''}] })
  const [tfMsg, setTfMsg] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/all-bookings'),
      api.get('/trains'),
    ]).then(([s, b, t]) => {
      setStats(s.data)
      setBookings(b.data.bookings || [])
      setTrains(t.data.trains || [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const deleteTrain = async (code) => {
    if (!window.confirm(`Delete train ${code}?`)) return
    try {
      await api.delete(`/admin/delete-train/${code}`)
      setTrains(prev => prev.filter(t => t.train_code !== code))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    }
  }

  const addTrain = async (e) => {
    e.preventDefault(); setTfMsg('')
    try {
      await api.post('/admin/add-train', trainForm)
      setTfMsg('✅ Train added successfully.')
      setTrains(prev => [...prev, trainForm])
      setTrainForm({ train_code:'', train_name:'', source:'', destination:'', departure_time:'', arrival_time:'', total_seats:100, fares:[{class:'Economy',fare:''},{class:'Business',fare:''},{class:'First',fare:''}] })
    } catch (err) {
      setTfMsg('❌ ' + (err.response?.data?.message || 'Failed to add train.'))
    }
  }

  const updateFare = (i, val) => {
    const fares = [...trainForm.fares]
    fares[i] = { ...fares[i], fare: val }
    setTrainForm(f => ({ ...f, fares }))
  }

  const STAT_CARDS = [
    { label: 'Total Users',    value: stats?.total_users    ?? '—', icon: 'group',         color: '#bc13fe' },
    { label: 'Active Trains',  value: stats?.total_trains   ?? '—', icon: 'train',         color: '#00f4fe' },
    { label: 'Total Bookings', value: stats?.total_bookings ?? '—', icon: 'receipt_long',  color: '#00e46b' },
    { label: 'Total Revenue',  value: stats?.total_revenue  ? `₹${Number(stats.total_revenue).toLocaleString()}` : '—', icon: 'payments', color: '#ebb2ff' },
  ]

  const TABS = ['overview', 'bookings', 'trains', 'add-train']

  return (
    <div className="bg-[#050505] text-[#e5e2e3] font-body-base min-h-screen flex">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full z-40 w-64 border-r border-white/10 flex flex-col font-['Space_Grotesk'] uppercase tracking-widest text-xs"
        style={{ background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="px-6 py-8">
          <h1 className="text-lg font-black text-fuchsia-500 tracking-tighter">RAIL COMMAND</h1>
          <p className="text-[10px] text-slate-500 mt-1">Admin Panel</p>
        </div>
        <div className="flex-1 space-y-1">
          {[
            { id:'overview',  icon:'dashboard',    label:'Overview' },
            { id:'bookings',  icon:'receipt_long', label:'All Bookings' },
            { id:'trains',    icon:'train',        label:'Fleet Management' },
            { id:'add-train', icon:'add_circle',   label:'Add Train' },
          ].map(({ id, icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 transition-colors text-left ${tab===id ? 'bg-fuchsia-600/10 text-fuchsia-400 border-r-4 border-fuchsia-600' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <span className="material-symbols-outlined text-base">{icon}</span>{label}
            </button>
          ))}
        </div>
        <div className="p-6 border-t border-white/5">
          <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-base">home</span>HOME
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="ml-64 p-10 w-full min-h-screen">
        {loading ? (
          <div className="flex justify-center pt-32">
            <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ── Overview ─────────────────────────── */}
            {tab === 'overview' && (
              <>
                <header className="mb-10 flex justify-between items-end">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-white">COMMAND OVERVIEW</h2>
                    <p className="text-slate-500 font-body-base">Live operational telemetry.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#00e46b]/10 border border-[#00e46b]/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#00e46b] animate-pulse"></span>
                    <span className="text-[10px] font-label-caps text-[#00e46b] uppercase">Systems Online</span>
                  </div>
                </header>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                  {STAT_CARDS.map(({ label, value, icon, color }) => (
                    <div key={label} className="rounded-2xl p-6 border border-white/10 relative overflow-hidden"
                      style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(20px)' }}>
                      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ background: color }}></div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
                        <p className="font-label-caps text-[10px] text-slate-500 uppercase">{label}</p>
                      </div>
                      <p className="text-2xl font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>
                {/* Recent bookings preview */}
                <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(20px)' }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-md text-xl text-white">Recent Bookings</h3>
                    <button onClick={() => setTab('bookings')} className="text-[#00f4fe] font-label-caps text-xs hover:text-white transition-colors">VIEW ALL →</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-[10px] font-label-caps text-slate-500 tracking-widest">
                        <tr>{['PNR','USER','TRAIN','CLASS','DATE','STATUS','AMOUNT'].map(h => <th key={h} className="px-4 pb-3">{h}</th>)}</tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0,5).map(b => (
                          <tr key={b.pnr_no} className="border-t border-white/5 text-white hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-data-mono text-[#ebb2ff]">#{b.pnr_no}</td>
                            <td className="px-4 py-3">{b.user_name}</td>
                            <td className="px-4 py-3 font-data-mono">{b.train_code}</td>
                            <td className="px-4 py-3">{b.class}</td>
                            <td className="px-4 py-3 font-data-mono">{b.journey_date ? new Date(b.journey_date).toLocaleDateString() : '—'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${b.ticket_status==='Confirmed'?'bg-[#00e46b]/10 border-[#00e46b]/30 text-[#00e46b]':b.ticket_status==='Cancelled'?'bg-red-500/10 border-red-500/30 text-red-400':'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                                {b.ticket_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-data-mono text-[#00e46b]">₹{b.amount || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ── All Bookings ──────────────────────── */}
            {tab === 'bookings' && (
              <div>
                <h2 className="font-headline-md text-headline-md text-white mb-8">ALL BOOKINGS</h2>
                <div className="rounded-2xl p-6 border border-white/10 overflow-x-auto" style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(20px)' }}>
                  <table className="w-full text-left text-sm text-white min-w-[900px]">
                    <thead className="text-[10px] font-label-caps text-slate-500 tracking-widest">
                      <tr>{['PNR','USER','PASSENGER','TRAIN','SOURCE → DEST','CLASS','DATE','STATUS','AMOUNT'].map(h=><th key={h} className="px-4 pb-3 whitespace-nowrap">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.pnr_no} className="border-t border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-data-mono text-[#ebb2ff]">#{b.pnr_no}</td>
                          <td className="px-4 py-3">{b.user_name}</td>
                          <td className="px-4 py-3">{b.passenger_name || '—'}</td>
                          <td className="px-4 py-3 font-data-mono">{b.train_code}</td>
                          <td className="px-4 py-3 text-xs">{b.source} → {b.destination}</td>
                          <td className="px-4 py-3">{b.class}</td>
                          <td className="px-4 py-3 font-data-mono">{b.journey_date ? new Date(b.journey_date).toLocaleDateString() : '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${b.ticket_status==='Confirmed'?'bg-[#00e46b]/10 border-[#00e46b]/30 text-[#00e46b]':b.ticket_status==='Cancelled'?'bg-red-500/10 border-red-500/30 text-red-400':'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                              {b.ticket_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-data-mono text-[#00e46b]">₹{b.amount || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && <p className="text-center py-12 text-slate-500">No bookings yet.</p>}
                </div>
              </div>
            )}

            {/* ── Fleet Management ──────────────────── */}
            {tab === 'trains' && (
              <div>
                <h2 className="font-headline-md text-headline-md text-white mb-8">FLEET MANAGEMENT</h2>
                <div className="rounded-2xl p-6 border border-white/10 overflow-x-auto" style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(20px)' }}>
                  <table className="w-full text-left text-sm text-white min-w-[700px]">
                    <thead className="text-[10px] font-label-caps text-slate-500 tracking-widest">
                      <tr>{['CODE','NAME','SOURCE','DESTINATION','DEPART','ARRIVE','SEATS','ACTIONS'].map(h=><th key={h} className="px-4 pb-3">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {trains.map(t => (
                        <tr key={t.train_code} className="border-t border-white/5 hover:bg-white/[0.02] group">
                          <td className="px-4 py-3 font-data-mono text-[#ebb2ff]">{t.train_code}</td>
                          <td className="px-4 py-3">{t.train_name}</td>
                          <td className="px-4 py-3">{t.source}</td>
                          <td className="px-4 py-3">{t.destination}</td>
                          <td className="px-4 py-3 font-data-mono">{t.departure_time?.slice(0,5) || '—'}</td>
                          <td className="px-4 py-3 font-data-mono">{t.arrival_time?.slice(0,5) || '—'}</td>
                          <td className="px-4 py-3">{t.total_seats}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => deleteTrain(t.train_code)}
                              className="opacity-0 group-hover:opacity-100 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {trains.length === 0 && <p className="text-center py-12 text-slate-500">No trains in fleet.</p>}
                </div>
              </div>
            )}

            {/* ── Add Train ─────────────────────────── */}
            {tab === 'add-train' && (
              <div>
                <h2 className="font-headline-md text-headline-md text-white mb-8">ADD NEW TRAIN</h2>
                {tfMsg && <div className={`mb-6 px-4 py-3 rounded-xl border text-sm ${tfMsg.startsWith('✅') ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>{tfMsg}</div>}
                <form onSubmit={addTrain} className="rounded-2xl p-8 border border-white/10 space-y-6"
                  style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(20px)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { key:'train_code',  label:'TRAIN CODE',  placeholder:'KR-601' },
                      { key:'train_name',  label:'TRAIN NAME',  placeholder:'Express Name' },
                      { key:'source',      label:'SOURCE',      placeholder:'Mumbai' },
                      { key:'destination', label:'DESTINATION', placeholder:'Delhi' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="font-label-caps text-[#d4c0d7] text-xs">{label}</label>
                        <input value={trainForm[key]} onChange={e => setTrainForm(f => ({ ...f, [key]: e.target.value }))} required
                          className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all"
                          placeholder={placeholder} />
                      </div>
                    ))}
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-[#d4c0d7] text-xs">DEPARTURE TIME</label>
                      <input type="time" value={trainForm.departure_time} onChange={e => setTrainForm(f => ({ ...f, departure_time: e.target.value }))}
                        className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-[#d4c0d7] text-xs">ARRIVAL TIME</label>
                      <input type="time" value={trainForm.arrival_time} onChange={e => setTrainForm(f => ({ ...f, arrival_time: e.target.value }))}
                        className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-[#d4c0d7] text-xs">TOTAL SEATS</label>
                      <input type="number" min="1" value={trainForm.total_seats} onChange={e => setTrainForm(f => ({ ...f, total_seats: +e.target.value }))}
                        className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono" />
                    </div>
                  </div>

                  <div>
                    <p className="font-label-caps text-[#d4c0d7] text-xs mb-3">FARES (₹)</p>
                    <div className="grid grid-cols-3 gap-4">
                      {trainForm.fares.map((f, i) => (
                        <div key={f.class} className="flex flex-col gap-2">
                          <label className="font-label-caps text-slate-500 text-[10px]">{f.class}</label>
                          <input type="number" min="1" value={f.fare} onChange={e => updateFare(i, e.target.value)}
                            className="bg-transparent border border-[#504254] rounded-lg px-4 py-3 text-white focus:border-[#ebb2ff] outline-none transition-all font-data-mono"
                            placeholder="0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit"
                    className="bg-[#bc13fe] text-white font-label-caps py-4 px-10 rounded-xl hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] active:scale-95 transition-all">
                    ADD TRAIN
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
