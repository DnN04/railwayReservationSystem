import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { TrainCardSkeleton } from '../components/Skeleton'

function SearchResults() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const qp        = new URLSearchParams(location.search)

  const [source,      setSource]      = useState(qp.get('source')      || '')
  const [destination, setDestination] = useState(qp.get('destination') || '')
  const [date,        setDate]        = useState(qp.get('date')        || '')
  const [trains,      setTrains]      = useState([])
  const [connectingTrains, setConnectingTrains] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [searched,    setSearched]    = useState(false)

  const fetchTrains = async (src, dest, dt) => {
    setLoading(true); setSearched(true)
    try {
      const { data } = await api.get('/trains', { params: { source: src, destination: dest, date: dt } })
      setTrains(data.directTrains || data.trains || [])
      setConnectingTrains(data.connectingTrains || [])
    } catch { setTrains([]); setConnectingTrains([]) }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetchTrains(qp.get('source') || '', qp.get('destination') || '', qp.get('date') || '') }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?source=${source}&destination=${destination}&date=${date}`)
    fetchTrains(source, destination, date)
  }

  const handleBook = (train, cls) => navigate('/booking', { state: { train, selectedClass: cls } })

  return (
    <div className="font-body-base text-on-surface min-h-screen bg-[#050505]">
      <Navbar />
      <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto">

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">location_on</span>
            <input required value={source} onChange={(e) => setSource(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
              placeholder="From (e.g. Mumbai)" />
          </div>
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">near_me</span>
            <input required value={destination} onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
              placeholder="To (e.g. Delhi)" />
          </div>
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">calendar_month</span>
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all [color-scheme:dark]" />
          </div>
          <button type="submit" className="bg-[#bc13fe] text-white px-10 py-4 rounded-xl font-bold font-label-caps hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] active:scale-95 transition-all">
            SEARCH
          </button>
        </form>

        {/* Results header */}
        <div className="flex items-end justify-between mb-8 text-white">
          <div>
            <h1 className="font-display-lg text-headline-md">Available Transits</h1>
            {(source || destination) && (
              <p className="text-[#d4c0d7] mt-1">{source || '—'}<span className="text-[#ebb2ff] mx-2">→</span>{destination || '—'}</p>
            )}
          </div>
          {searched && !loading && (
            <div className="font-data-mono bg-[#1c1b1c] px-4 py-2 rounded-full border border-[#504254]">
              {trains.length} Result{trains.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* States */}
        {loading && (
          <div className="space-y-6">
            <TrainCardSkeleton />
            <TrainCardSkeleton />
            <TrainCardSkeleton />
          </div>
        )}
        {!loading && searched && trains.length === 0 && connectingTrains.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 text-slate-500"
          >
            <span className="material-symbols-outlined text-6xl mb-4 block">train</span>
            <p className="font-headline-md text-xl text-white mb-2">No trains found</p>
            <p>Try a different source, destination, or date.</p>
          </motion.div>
        )}

        {/* Direct Train cards */}
        {!loading && trains.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display-lg text-2xl text-white mb-6">Direct Options</h2>
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
            {trains.map((train, idx) => (
              <motion.div 
                key={train.train_code}
                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                whileHover={{ y: -5 }}
                className="rounded-3xl p-8 border border-white/10 hover:border-[#bc13fe]/40 hover:shadow-[0_0_30px_rgba(188,19,254,0.1)] transition-all relative"
                style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(255,255,255,0.02) 100%)' }}
              >
                {idx === 0 && <div className="absolute top-0 right-0 px-6 py-2 bg-[#bc13fe] text-white font-label-caps text-[10px] rounded-bl-2xl rounded-tr-3xl">FEATURED ROUTE</div>}

                <div className="flex flex-col md:flex-row gap-8 items-center text-white">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#ebb2ff]/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#ebb2ff]">train</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md">{train.train_name}</h3>
                        <span className="text-[#00e46b] font-label-caps text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00e46b] animate-pulse"></span> Available
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{train.departure_time?.slice(0,5) || '--:--'}</div>
                        <div className="text-[#d4c0d7] font-label-caps text-[10px] uppercase">{train.source}</div>
                      </div>
                      <div className="flex-1 px-4 flex flex-col items-center">
                        <div className="w-full h-0.5 bg-[#504254] rounded-full relative overflow-hidden">
                          <motion.div 
                            className="absolute inset-0 w-1/2 bg-[#ebb2ff]"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          />
                        </div>
                        <span className="material-symbols-outlined text-[#ebb2ff] text-sm mt-1">directions_railway</span>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{train.arrival_time?.slice(0,5) || '--:--'}</div>
                        <div className="text-[#d4c0d7] font-label-caps text-[10px] uppercase">{train.destination}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 md:border-l border-white/10 md:pl-8 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {['Economy','Business','First'].map(cls => (
                        <motion.button 
                          key={cls} 
                          onClick={() => handleBook(train, cls)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center p-2 rounded-xl border border-white/10 hover:border-[#bc13fe] hover:bg-[#bc13fe]/10 transition-all"
                        >
                          <span className="text-[10px] font-label-caps text-[#d4c0d7]">
                            {cls === 'Economy' ? 'ECON' : cls === 'Business' ? 'BIZ' : 'FIRST'}
                          </span>
                          <span className="font-data-mono text-sm">
                            {train.fares?.[cls] ? `₹${train.fares[cls]}` : '—'}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        onClick={() => navigate('/live', { state: { train } })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white/5 border border-white/10 text-[#00f4fe] py-3 rounded-2xl font-bold font-label-caps text-[10px] sm:text-xs flex items-center justify-center gap-1 hover:bg-[#00f4fe]/10 transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">explore</span> Map
                      </motion.button>
                      <motion.button 
                        onClick={() => handleBook(train, 'Economy')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-[2] bg-[#bc13fe] text-white py-3 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all text-sm"
                      >
                        Book Seats
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        )}

        {/* Connecting Train cards */}
        {!loading && connectingTrains.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-[#bc13fe] text-3xl">hub</span>
              <h2 className="font-display-lg text-2xl text-white">Smart Connections</h2>
            </div>
            
            <motion.div 
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
            >
              {connectingTrains.map((conn, idx) => (
                <motion.div 
                  key={`${conn.train1.train_code}-${conn.train2.train_code}`}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="rounded-3xl p-8 border border-[#00f4fe]/30 hover:shadow-[0_0_30px_rgba(0,244,254,0.1)] transition-all relative overflow-hidden"
                  style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(0,244,254,0.05) 0%,rgba(0,0,0,0.5) 100%)' }}
                >
                  {idx === 0 && trains.length === 0 && <div className="absolute top-0 right-0 px-6 py-2 bg-[#00f4fe] text-black font-bold font-label-caps text-[10px] rounded-bl-2xl">RECOMMENDED ALTERNATIVE</div>}

                  <div className="flex flex-col md:flex-row gap-8 text-white">
                    <div className="flex-1 w-full space-y-6">
                      
                      {/* Leg 1 */}
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#bc13fe]/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#bc13fe] text-sm">train</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-headline-md">{conn.train1.train_name}</span>
                            <span className="font-data-mono text-xs text-slate-400">{conn.train1.journey_date}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span><strong className="text-xl">{conn.train1.departure_time?.slice(0,5)}</strong> {conn.train1.source}</span>
                            <span className="text-slate-500">→</span>
                            <span><strong className="text-xl">{conn.train1.arrival_time?.slice(0,5)}</strong> {conn.train1.destination}</span>
                          </div>
                        </div>
                      </div>

                      {/* Transit Hub */}
                      <div className="flex items-center gap-4 pl-4 border-l-2 border-dashed border-slate-600 ml-4 py-2">
                        <span className="material-symbols-outlined text-[#00f4fe] text-sm animate-pulse">explore</span>
                        <span className="font-label-caps text-xs text-[#00f4fe]">TRANSIT HUB: {conn.hub}</span>
                      </div>

                      {/* Leg 2 */}
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#bc13fe]/20 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#bc13fe] text-sm">train</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-headline-md">{conn.train2.train_name}</span>
                            <span className="font-data-mono text-xs text-[#00e46b]">{conn.train2.journey_date}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span><strong className="text-xl">{conn.train2.departure_time?.slice(0,5)}</strong> {conn.train2.source}</span>
                            <span className="text-slate-500">→</span>
                            <span><strong className="text-xl">{conn.train2.arrival_time?.slice(0,5)}</strong> {conn.train2.destination}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="w-full md:w-72 md:border-l border-white/10 md:pl-8 flex flex-col justify-center">
                      <p className="font-label-caps text-slate-400 text-xs mb-4">TOTAL COMBINED FARE</p>
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {['Economy','Business'].map(cls => {
                          const f1 = conn.train1.fares?.[cls] || 0;
                          const f2 = conn.train2.fares?.[cls] || 0;
                          const total = f1 + f2;
                          return total > 0 ? (
                            <motion.button 
                              key={cls} 
                              onClick={() => navigate('/booking', { state: { connections: [conn.train1, conn.train2], selectedClass: cls } })}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex flex-col items-center p-3 rounded-xl border border-[#00f4fe]/30 hover:border-[#00f4fe] hover:bg-[#00f4fe]/10 transition-all"
                            >
                              <span className="text-[10px] font-label-caps text-[#00f4fe]">
                                {cls === 'Economy' ? 'ECON' : 'BIZ'}
                              </span>
                              <span className="font-data-mono text-sm text-white">
                                ₹{total}
                              </span>
                            </motion.button>
                          ) : null;
                        })}
                      </div>
                      <motion.button 
                        onClick={() => navigate('/booking', { state: { connections: [conn.train1, conn.train2], selectedClass: 'Economy' } })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#00f4fe] text-black py-3 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(0,244,254,0.5)] transition-all font-label-caps"
                      >
                        BOOK FULL JOURNEY
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

export default SearchResults
