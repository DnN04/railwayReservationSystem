import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(1)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?source=${source}&destination=${destination}&date=${date}&guests=${guests}`)
  }

  return (
    <div className="font-body-base overflow-x-hidden" style={{ backgroundColor: 'transparent', color: '#e5e2e3' }}>
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        {/* Ambient background lighting */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[20%] w-[400px] h-[400px] bg-[#bc13fe]/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-[#00f4fe]/10 rounded-full blur-[80px]"></div>
        </div>

        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="font-display-lg text-5xl md:text-6xl text-white mb-2 tracking-tighter uppercase leading-[0.9]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bc13fe] to-[#00f4fe]">NETWORK</span>
          </motion.h1>
          <motion.p 
            className="font-headline-md text-on-surface-variant max-w-2xl mx-auto opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Search routes, check live availability, and explore transit hubs.
          </motion.p>
        </motion.div>

        {/* Search Widget */}
        <motion.div 
          className="glass-card w-full max-w-5xl mx-auto p-2 rounded-3xl overflow-hidden shadow-2xl relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 50 }}
        >
          <form onSubmit={handleSearch} className="bg-[#131314]/40 backdrop-blur-3xl rounded-[22px] p-8 md:p-10 flex flex-col md:flex-row items-end gap-6">
            <div className="w-full md:flex-1 space-y-2">
              <label className="font-label-caps text-label-caps text-fuchsia-400 block px-1">From</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">location_on</span>
                <input required value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all" placeholder="Departure City" type="text" />
              </div>
            </div>
            <div className="w-full md:flex-1 space-y-2">
              <label className="font-label-caps text-label-caps text-fuchsia-400 block px-1">To</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">near_me</span>
                <input required value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all" placeholder="Destination" type="text" />
              </div>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="font-label-caps text-label-caps text-fuchsia-400 block px-1">Date</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">calendar_month</span>
                <input required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all [color-scheme:dark]" placeholder="Select Date" type="date" />
              </div>
            </div>
            <div className="w-full md:w-32 space-y-2">
              <label className="font-label-caps text-label-caps text-fuchsia-400 block px-1">Guests</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">group</span>
                <input value={guests} onChange={(e) => setGuests(Math.min(2, Math.max(1, parseInt(e.target.value) || 1)))} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all" min="1" max="2" type="number" />
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full md:w-auto">
              <button
                type="submit"
                className="block w-full bg-[#bc13fe] text-white px-10 py-4 rounded-xl font-bold font-label-caps neon-glow-primary text-center"
              >
                SEARCH
              </button>
            </motion.div>
          </form>
        </motion.div>
      </section>

      {/* Trending Routes */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-headline-md text-headline-md text-white mb-2">TRENDING ROUTES</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#bc13fe] to-transparent rounded-full relative overflow-hidden">
              <div className="scanning-bar absolute inset-0"></div>
            </div>
          </div>
          <Link className="font-label-caps text-[#00f4fe] hover:text-white transition-colors flex items-center gap-2" to="/search">
            VIEW GLOBAL NETWORK <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
        >
          {/* Large Main Card - KR-202 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] h-[400px] border border-white/10 isolate z-0">
            <img
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 -z-10"
              src="/images/desi_delhi_shimla.png"
              alt="Himalayan Queen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent -z-10"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-[#00e46b]/10 border border-[#00e46b]/30 rounded-full text-[#00e46b] text-[10px] font-bold tracking-widest mb-3 uppercase">KR-202 • ON TIME</span>
                <h3 className="font-display-lg text-3xl md:text-4xl text-white">HIMALAYAN QUEEN</h3>
                <p className="text-on-surface-variant/80 font-data-mono">Scenic toy train journey from Delhi to Shimla</p>
              </div>
              <div className="text-right">
                <p className="text-fuchsia-400 font-label-caps">STARTING FROM</p>
                <p className="text-3xl font-black text-white">₹300.00</p>
              </div>
            </div>
          </motion.div>

          {/* Route Small 1 - KR-101 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="group relative overflow-hidden rounded-[2rem] border border-white/10 isolate z-0">
            <img
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 -z-10"
              src="/images/desi_mumbai_delhi.png"
              alt="Vande Bharat Express"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="font-headline-md text-white mb-1">VANDE BHARAT (KR-101)</h3>
              <p className="text-on-surface-variant font-data-mono text-xs opacity-70 mb-4">Mumbai to Delhi • 06h 00m</p>
              <Link to="/search?source=Mumbai&destination=Delhi" className="block w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-label-caps text-white text-center hover:bg-[#bc13fe] transition-colors">SEARCH ROUTE</Link>
            </div>
          </motion.div>

          {/* Route Small 2 - KR-303 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="group relative overflow-hidden rounded-[2rem] border border-white/10 isolate z-0">
            <img
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 -z-10"
              src="/images/desi_chennai_goa.png"
              alt="Konkan Kanya"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="font-headline-md text-white mb-1">KONKAN KANYA (KR-303)</h3>
              <p className="text-on-surface-variant font-data-mono text-xs opacity-70 mb-4">Chennai to Goa • 08h 00m</p>
              <Link to="/search?source=Chennai&destination=Goa" className="block w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-label-caps text-white text-center hover:bg-[#bc13fe] transition-colors">SEARCH ROUTE</Link>
            </div>
          </motion.div>

          {/* Silicon Valley Banner - KR-505 / KR-411 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] h-[300px] border border-white/10 isolate z-0">
            <img className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 -z-10" src="/images/desi_pune_mumbai.png" alt="Deccan Queen" />
            <div className="absolute inset-0 bg-[#1c1b1c]/80 backdrop-blur-md flex items-center px-12 gap-12 -z-10">
              <div className="flex-1">
                <div className="flex gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#00f4fe] animate-pulse"></span>
                  <span className="text-[10px] font-label-caps text-[#00f4fe] tracking-widest">KR-505 • PUNE TO MUMBAI</span>
                </div>
                <h3 className="font-display-lg text-3xl text-white mb-2">DECCAN QUEEN</h3>
                <p className="text-on-surface-variant mb-6 max-w-md">Iconic journey traversing the breathtaking Western Ghats in the monsoon.</p>
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-label-caps">DURATION</span>
                    <span className="text-white font-data-mono">02h 00m</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-label-caps">FARES START</span>
                    <span className="text-white font-data-mono">₹250.00</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5" style={{ backgroundColor: 'transparent' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-label-caps tracking-widest mb-1">SYSTEM STATUS</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00e46b]" style={{ boxShadow: '0 0 8px rgba(0,228,107,0.5)' }}></span>
                <span className="text-white font-data-mono uppercase">All Networks Nominal</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-label-caps tracking-widest mb-1">LIVE FLEET</span>
              <span className="text-white font-data-mono">1,248 ACTIVE TRAINS</span>
            </div>
          </div>
          <div className="flex gap-8 text-slate-500 font-label-caps text-[10px]">
            <a className="hover:text-white transition-colors" href="#">PRIVACY PROTOCOL</a>
            <a className="hover:text-white transition-colors" href="#">CARRIER TERMS</a>
            <a className="hover:text-white transition-colors" href="#">SYSTEM INTEL</a>
          </div>
          <div className="font-['Space_Grotesk'] text-xl font-black text-fuchsia-600/50">RAIL BANDHU</div>
        </div>
      </footer>
    </div>
  )
}

export default Home
