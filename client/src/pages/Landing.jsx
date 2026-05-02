import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

function Landing() {
  return (
    <div className="min-h-screen font-body-base overflow-x-hidden relative" style={{ backgroundColor: '#050505', color: '#e5e2e3' }}>
      <Navbar />

      {/* Ambient glowing background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#bc13fe]/20 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00f4fe]/20 rounded-full blur-[120px]"
        />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center h-[100dvh] overflow-hidden pt-20 px-4">
        
        <motion.div 
          className="text-center max-w-5xl w-full flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Badge */}
          <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="mb-4 flex justify-center">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[#00f4fe] font-data-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 shadow-[0_0_20px_rgba(0,244,254,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f4fe] animate-pulse"></span>
              The Outdated Railway is Dead
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="font-display-lg text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[0.9] mb-4"
          >
            GenZ Transit<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f4fe] via-[#bc13fe] to-[#ebb2ff]">
              Revolution
            </span>
          </motion.h1>

          {/* Subtitle / PRD Mission */}
          <motion.p 
            variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
            className="font-headline-md text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto opacity-90 mb-6 leading-relaxed"
          >
            We are replacing the clunky, traditional ticket booking systems with a modern, high-speed interface. Experience seamless booking, intelligent routing, and absolute control.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/login" className="flex items-center justify-center gap-2 bg-[#bc13fe] text-white px-6 py-3 rounded-xl font-bold font-label-caps text-xs md:text-sm uppercase tracking-widest hover:shadow-[0_0_40px_rgba(188,19,254,0.4)] transition-all">
                Sign In to Book <span className="material-symbols-outlined text-base">bolt</span>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/dashboard" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold font-label-caps text-xs md:text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                Explore Network <span className="material-symbols-outlined text-base">explore</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
            className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-white/10 pt-6"
          >
            {[
              { icon: 'speed', title: 'HYPER-SPEED UI', desc: 'No loading screens. Instant searches.' },
              { icon: 'security', title: 'SECURE BOOKINGS', desc: 'JWT protected routing & DB triggers.' },
              { icon: 'admin_panel_settings', title: 'TOTAL CONTROL', desc: 'Powerful admin dashboards.' }
            ].map(feat => (
              <motion.div key={feat.title} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2 flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00f4fe] text-sm">{feat.icon}</span>
                </div>
                <h3 className="font-headline-md text-white text-sm">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </main>
    </div>
  )
}

export default Landing
