import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/search?source=${source}&destination=${destination}&date=${date}`)
  }

  return (
    <div className="font-body-base overflow-x-hidden" style={{ backgroundColor: '#050505', color: '#e5e2e3' }}>
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
                <input className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500/50 transition-all" min="1" type="number" defaultValue="1" />
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
          {/* Large Main Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] h-[400px] border border-white/10">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsXj1Mpjbejfw2zDYMjPhtCT9ZueYiaYeEkAPLw8w_4WxSa9B_obIxhfXUw7S7R7KAQPez9dADK31n9NTPARhzB-QCb2kN8ynE2-KaSIb3NoEMCXGphVlYLS2R3tuSg8zm6hJ-qycDO34KYDAmJBv1uNLE3hADWqk_dRO6BqnyORgoYhwlzmxk4_dZzF-4OwRQoK_lRY9ixilVYNu1A5DIUIoK9IOx9G7V-wtp4b227Fd8rNW3a3es4aZ_ilJLWNUPYitK88il6BM"
              alt="Neo Tokyo Express futuristic cityscape"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end">
              <div>
                <span className="inline-block px-3 py-1 bg-[#00e46b]/10 border border-[#00e46b]/30 rounded-full text-[#00e46b] text-[10px] font-bold tracking-widest mb-3 uppercase">ON TIME • HYPER-SPEED</span>
                <h3 className="font-display-lg text-4xl text-white">NEO TOKYO EXPRESS</h3>
                <p className="text-on-surface-variant/80 font-data-mono">Non-stop service from Nexus-1 Hub</p>
              </div>
              <div className="text-right">
                <p className="text-fuchsia-400 font-label-caps">STARTING FROM</p>
                <p className="text-3xl font-black text-white">$124.00</p>
              </div>
            </div>
          </motion.div>

          {/* Route Small 1 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="group relative overflow-hidden rounded-[2rem] border border-white/10">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4jb5BPrQVwI8crB1EuWwL7ujkYGFWZzz87-z8FdRJyVnajrBJbDLm6lt6VeFpaR7AKkUxx_gHZgao73__QbcEEh38PFC6HmD9UlwyuzgQBGuHc5u4EPEsvKiI1YAggFTmWqcBB9WY0w2tv_8rGwGIb1Bw2roIhhLC9sByfbnYaKRwObmd6_na0n0M8p3qCTCNwR3zsJZvPeLek7PA98386qMTZe_htZZlSoJanIGZIaLk3pWXX-GsHCSZNiyHa-wN6dAFjTKB_cg"
              alt="Alpine dome mountain resort"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="font-headline-md text-white mb-1">ALPINE DOME</h3>
              <p className="text-on-surface-variant font-data-mono text-xs opacity-70 mb-4">Transit time: 02h 45m</p>
              <Link to="/booking" className="block w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-label-caps text-white text-center hover:bg-[#bc13fe] transition-colors">BOOK PASS</Link>
            </div>
          </motion.div>

          {/* Route Small 2 */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="group relative overflow-hidden rounded-[2rem] border border-white/10">
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXj8RF2iI1tL6IEnA6rLIbCvGKZB_SKBy6txalirysvnTR8brJKhfEN9kLyUkVgr0ummERgVymjVBcOpwX9y75uRxQsbQ11pD6WLCsWREJmHnyZl1YTN1aLMZuX7DL7xvxMxCIEBIHajP3DZo32nG_tpZmnF2HQH-LEFjZqP2MdG47hHquUWAMFst_JdTGFZ_RSgNRf6nzLkzSPz4AZLALOGydCxNcVsM8NkZ64eNQAZqTscTIyJxB178WaaRrf3DPw5IVG8RL4Hs"
              alt="Azure coast Mediterranean city"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h3 className="font-headline-md text-white mb-1">AZURE COAST</h3>
              <p className="text-on-surface-variant font-data-mono text-xs opacity-70 mb-4">Transit time: 04h 12m</p>
              <Link to="/booking" className="block w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-label-caps text-white text-center hover:bg-[#bc13fe] transition-colors">BOOK PASS</Link>
            </div>
          </motion.div>

          {/* Silicon Valley Banner */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] h-[300px] border border-white/10">
            <div className="absolute inset-0 bg-[#1c1b1c]/80 backdrop-blur-md flex items-center px-12 gap-12">
              <div className="flex-1">
                <div className="flex gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#00f4fe] animate-pulse"></span>
                  <span className="text-[10px] font-label-caps text-[#00f4fe] tracking-widest">LIVE AVAILABILITY</span>
                </div>
                <h3 className="font-display-lg text-3xl text-white mb-2">SILICON VALLEY SHUTTLE</h3>
                <p className="text-on-surface-variant mb-6 max-w-md">Ultra-low latency connectivity onboard. Optimized for the remote executive.</p>
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-label-caps">FREQUENCY</span>
                    <span className="text-white font-data-mono">EVERY 15 MIN</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-label-caps">CLASS</span>
                    <span className="text-white font-data-mono">PRIME ONLY</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Your Next Journey */}
      <section className="bg-[#0e0e0f]/50 py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-headline-md text-headline-md text-white mb-2">YOUR NEXT JOURNEY</h2>
            <p className="text-on-surface-variant font-body-base">Personalized suggestions based on your transit profile.</p>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {[
              { name: 'NEO-KYOTO SANCTUARY', tag: 'WELLNESS HUB • 3H FROM HUB', price: '$210', badge: 'LAST SEEN 2M AGO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAabr8akoV9ik-mM4e1kCaCjd2hYKTmaJu_VaccgPcc1CuQH00rJ3mCkt677IpOTqnpDk56L7hjGPP3ECu3A24xumPiD8-y9l1Dmg7cUSYw6834nu8yVZo8hr7aKBR2D_BRn32Z5MQhEzYe1zggEqcOWxOfvB0Rsq3WgQNuoDbaJwVSOW2UnLqXKIYrwTl7H54ggvMOLp08FCEKkETwbG8m86QIfKtaQBS21YLPZ60BXSyFGtChliDD6OVTJVpnHTXj_sWdEIhNoYg' },
              { name: 'THE OBSIDIAN CORRIDOR', tag: 'ADVENTURE • 1.5H FROM HUB', price: '$85', badge: 'BEST VALUE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzErUQl6axmtGY1PVvoyOAL1gSqUZx1iCuPRyk4vKsV5r40c3U1PKep92oi-6HhOMDWjHZBP9Dpa7xZ3EIe4wj8i9WU2SNZ1qT0vvDSDCDVmGK06H043K19spiXsGKH96dPrawxGWTIfkTDsISl9CrQAqp4tX0K6L6ZDftnGviRq3JPsBUGKrsLn9sS-S97RCCJ7Qc_vkXjZXcT-pkbgG7LJLdyZI3p6zFAiXfB4U5QKeebJosaH7rGZggPER4rqWbZrScIDfGyaw' },
              { name: 'SKY GARDEN DISTRICT', tag: 'ECO-URBAN • 45M FROM HUB', price: '$42', badge: 'POPULAR CHOICE', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNLnR1QGAWlLTEaRVGWd8Atg3CYNJ6wnAlPzfq_1mwAD8NgplZLJNaK2XQOXBuvLLVvoyWrTLsIrwMdRd_xuRZEdnqbWuzn5OLj-GmbwKnvwCaNsvDC_ykZjMKPXi7uZJqLSov1RzoXinbpKNTv8-7QdtBlN7VgmOAGnvFixMOlyGfsR2xlpUe0oo7AIr5xoQpGTuArd68LDFywWh5kK301Trnzu6kyWbVCcn1oWzGKVF0M2WdlyMihG9_6ddaEt4yhAMOh9T-H98' },
              { name: 'NEON NIGHT MARKET', tag: 'CULTURAL • 2.5H FROM HUB', price: '$115', badge: 'NEWLY ADDED', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaUCIKUYR_RvaWXo88AHIC_BAQ3yD9dD4XeQP11x5XDy0gIK-Hyr2TMONfMZyyiApTKtux1crvCbYGYAP8YAa9syYe3EF8v59Y3lS1b6ZgLfLRbGpiHZ7VwlfELrPTS0nEg4UUMgJ_W4v5gGHMD922ty9dJH5rlptpPV0Q9tWflhn1LuL3byHSMOKUJc3-lD9mF-1xcpNTBSEvyjhHIdDTNE-ZWPEAhwqiory3o8bgjmCj8ertg_0ymE4odRYpnps4aYcyNduB7rQ' },
            ].map((item) => (
              <motion.div 
                key={item.name} 
                className="glass-card p-4 rounded-3xl group cursor-pointer"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 relative">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.img} alt={item.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-white">explore</span>
                  </div>
                </div>
                <h4 className="font-headline-md text-white text-lg mb-1">{item.name}</h4>
                <p className="text-on-surface-variant font-data-mono text-xs mb-4">{item.tag}</p>
                <div className="flex items-center justify-between">
                  <span className="text-fuchsia-400 font-bold">{item.price}</span>
                  <span className="text-[10px] text-slate-500 font-label-caps">{item.badge}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5" style={{ backgroundColor: '#050505' }}>
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
          <div className="font-['Space_Grotesk'] text-xl font-black text-fuchsia-600/50">VELOCITY</div>
        </div>
      </footer>
    </div>
  )
}

export default Home
