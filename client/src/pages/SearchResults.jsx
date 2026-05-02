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
  const [trains,      setTrains]      = useState([])
  const [loading,     setLoading]     = useState(false)
  const [searched,    setSearched]    = useState(false)

  const fetchTrains = async (src, dest) => {
    setLoading(true); setSearched(true)
    try {
      const { data } = await api.get('/trains', { params: { source: src, destination: dest } })
      setTrains(data.trains || [])
    } catch { setTrains([]) }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetchTrains(qp.get('source') || '', qp.get('destination') || '') }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?source=${source}&destination=${destination}`)
    fetchTrains(source, destination)
  }

  const handleBook = (train, cls) => navigate('/booking', { state: { train, selectedClass: cls } })

  return (
    <div className="font-body-base text-on-surface min-h-screen bg-[#050505]">
      <Navbar />
      <main className="pt-32 pb-12 px-8 max-w-7xl mx-auto">

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
          {[
            { value: source,      onChange: e => setSource(e.target.value),      icon: 'location_on', placeholder: 'From (e.g. Mumbai)' },
            { value: destination, onChange: e => setDestination(e.target.value), icon: 'near_me',    placeholder: 'To (e.g. Delhi)'  },
          ].map(({ value, onChange, icon, placeholder }) => (
            <div key={placeholder} className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
              <input value={value} onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-500"
                placeholder={placeholder} />
            </div>
          ))}
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
        {!loading && searched && trains.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 text-slate-500"
          >
            <span className="material-symbols-outlined text-6xl mb-4 block">train</span>
            <p className="font-headline-md text-xl text-white mb-2">No trains found</p>
            <p>Try a different source or destination.</p>
          </motion.div>
        )}

        {/* Train cards */}
        {!loading && trains.length > 0 && (
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
                    <motion.button 
                      onClick={() => handleBook(train, 'Economy')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#bc13fe] text-white py-3 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(188,19,254,0.5)] transition-all"
                    >
                      Book Seats
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default SearchResults
