import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { TicketCardSkeleton } from '../components/Skeleton'

const STATUS_COLORS = {
  Confirmed: 'bg-[#00e46b]/10 border-[#00e46b]/30 text-[#00e46b]',
  Pending:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  Cancelled: 'bg-red-500/10 border-red-500/30 text-red-400',
}

function MyTickets() {
  const { user }                = useAuth()
  const [tickets,  setTickets]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')

  useEffect(() => {
    api.get('/my-tickets')
      .then(({ data }) => setTickets(data.tickets || []))
      .catch(() => setError('Failed to load tickets.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#050505] text-on-surface font-body-base min-h-screen pb-20">
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label-caps text-label-caps text-[#bc13fe] mb-2 block">DASHBOARD</span>
            <h1 className="font-display-lg text-4xl text-white">Active Journeys</h1>
            {user && <p className="text-slate-400 mt-1 font-body-base">Welcome back, {user.name}</p>}
          </div>
          <div className="border border-white/10 rounded-xl px-6 py-3 flex items-center gap-4"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined text-[#e6feff]">confirmation_number</span>
            <div>
              <p className="font-label-caps text-[10px] text-slate-500">TOTAL TICKETS</p>
              <p className="font-data-mono text-white text-lg">{String(tickets.length).padStart(2,'0')}</p>
            </div>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <TicketCardSkeleton />
            <TicketCardSkeleton />
            <TicketCardSkeleton />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 text-red-400"
          >
            <span className="material-symbols-outlined text-5xl block mb-3">error</span>
            <p>{error}</p>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && tickets.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 text-slate-500"
          >
            <span className="material-symbols-outlined text-6xl block mb-4">confirmation_number</span>
            <p className="font-headline-md text-xl text-white mb-2">No tickets yet</p>
            <p className="mb-6">Book your first journey to get started.</p>
            <Link to="/search"
              className="inline-block bg-[#bc13fe] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all">
              Search Trains
            </Link>
          </motion.div>
        )}

        {/* Ticket grid */}
        {!loading && tickets.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {tickets.map(ticket => (
              <motion.div 
                key={ticket.pnr_no}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
                className="rounded-2xl overflow-hidden flex flex-col border border-white/10 hover:border-[#bc13fe]/40 hover:shadow-[0_10px_30px_rgba(188,19,254,0.1)] transition-all"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}
              >
                <div className="p-6 flex-1 text-white relative overflow-hidden">
                  {/* Subtle background glow based on status */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${ticket.ticket_status==='Confirmed'?'bg-[#00e46b]':ticket.ticket_status==='Cancelled'?'bg-red-500':'bg-yellow-500'}`} />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                      <p className="font-label-caps text-[10px] text-slate-500 mb-1">TRAIN</p>
                      <p className="font-data-mono text-lg">{ticket.train_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${STATUS_COLORS[ticket.ticket_status] || STATUS_COLORS.Pending}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {ticket.ticket_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
                    <div>
                      <p className="font-label-caps text-[10px] text-slate-500 mb-1">DEPARTURE</p>
                      <p className="font-headline-md text-xl">{ticket.departure_time?.slice(0,5) || '--:--'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{ticket.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-caps text-[10px] text-slate-500 mb-1">ARRIVAL</p>
                      <p className="font-headline-md text-xl">{ticket.arrival_time?.slice(0,5) || '--:--'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{ticket.destination}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-3 text-sm font-data-mono relative z-10">
                    <div><p className="text-[10px] text-slate-500">PNR</p><p className="text-[#ebb2ff] font-bold">#{ticket.pnr_no}</p></div>
                    <div><p className="text-[10px] text-slate-500">SEAT</p><p>{ticket.seat_no || '—'}</p></div>
                    <div><p className="text-[10px] text-slate-500">CLASS</p><p>{ticket.class}</p></div>
                    <div><p className="text-[10px] text-slate-500">DATE</p><p>{ticket.journey_date ? new Date(ticket.journey_date).toLocaleDateString() : '—'}</p></div>
                  </div>
                </div>

                <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center text-white">
                  <div>
                    <p className="text-[10px] text-slate-500 font-label-caps">PASSENGER</p>
                    <p className="text-sm font-data-mono">{ticket.passenger_name || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-label-caps">PAID</p>
                    <p className="text-[#00e46b] font-data-mono font-bold">₹{ticket.amount || '—'}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="rounded-2xl p-8 flex flex-col justify-between border border-[#00f4fe]/20 hover:border-[#00f4fe]/50 hover:shadow-[0_0_30px_rgba(0,244,254,0.1)] transition-all"
              style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.03)' }}
            >
              <div>
                <span className="material-symbols-outlined text-[#00f4fe] text-4xl mb-4 block">add_circle</span>
                <h3 className="font-headline-md text-white mb-2">New Booking</h3>
                <p className="text-slate-400 text-sm">Search trains and secure your next seat instantly.</p>
              </div>
              <Link to="/search"
                className="mt-8 block text-center border border-[#00f4fe] text-[#00f4fe] font-label-caps py-3 rounded-xl hover:bg-[#00f4fe] hover:text-black transition-all">
                START SEARCH
              </Link>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default MyTickets
