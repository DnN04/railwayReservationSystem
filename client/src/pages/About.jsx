import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen font-body-base overflow-x-hidden relative" style={{ backgroundColor: 'transparent', color: '#e5e2e3' }}>
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

      <div className="relative z-10 pt-32 pb-20 px-8 mx-auto w-[92%] max-w-5xl">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">
              About Rail Bandhu
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
              Revolutionizing the railway reservation experience with a modern, intelligent, and seamless platform.
            </p>
          </motion.div>

          {/* Grid Layout for Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/[0.07] transition-colors shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-red-400 text-3xl">warning</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">The Problem</h2>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Traditional railway booking systems often suffer from outdated interfaces, confusing navigation, and a lack of intelligent routing. Users struggle to find connecting trains when direct routes are unavailable, leading to a frustrating and time-consuming booking experience.
              </p>
            </motion.div>

            {/* The Solution */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/[0.07] transition-colors shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Our Solution</h2>
              </div>
              <p className="text-slate-300 leading-relaxed font-medium">
                Rail Bandhu introduces a sleek, user-centric interface coupled with a Smart Connections algorithm. It dynamically calculates multi-leg journeys, offering seamless connectivity suggestions and unified booking flows to ensure you reach your destination effortlessly.
              </p>
            </motion.div>

            {/* Tech Stack */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:bg-white/[0.07] transition-colors shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-cyan-400 text-3xl">code</span>
                <h2 className="text-2xl font-bold text-white tracking-tight">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  'React.js', 'Tailwind CSS', 'Framer Motion', 'Node.js', 
                  'Express.js', 'MongoDB', 'Mongoose', 'JWT Authentication'
                ].map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-data-mono text-sm hover:border-fuchsia-500/50 hover:text-fuchsia-300 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Contributors */}
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-fuchsia-600/20 to-cyan-600/20 border border-fuchsia-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(188,19,254,0.15)] md:col-span-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-fuchsia-400 text-3xl">group</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Meet the Contributors</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Contributor 1 */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-fuchsia-500/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      DN
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Durgesh Narayan Nayak</h3>
                      <p className="text-fuchsia-400 text-sm font-medium">Core Contributor</p>
                    </div>
                  </div>

                  {/* Contributor 2 */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      AS
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Aditya Kumar Singh</h3>
                      <p className="text-cyan-400 text-sm font-medium">Core Contributor</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
