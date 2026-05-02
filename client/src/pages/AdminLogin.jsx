function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] font-body-base text-on-surface">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Background Data Visualization"
          className="w-full h-full object-cover opacity-20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0BM9T0d8hPpdQGFdwYZIktUMZ5vnhc9eUOm6VINWXdd1JgOeFCkFkG1rspqTin8CTBLWnTtCxUeKRp-n5n2W0BWqX4fSdVX3v4G6AwM7LgFboGMCGc4TLdVc-f2uKSp431yg-nsS1Dccq42IvuThxfPPiIdKmMre31ITTtbC2CUzaT17ZK7ghdxE0Zu8K6EFOjBmS6lBYzZQJ3tLB5RByiTTSFxfwSNZmkBzrkLpl598W5rElY2Ic_QS5NrZBktsfrQatO4XXUE"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-[#131314] opacity-90"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md px-6">
        <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-2 border border-white/10" style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)' }}>
          {/* Brand Identity */}
          <div className="mb-6 text-center">
            <h1 className="font-headline-md text-headline-md text-[#ebb2ff] tracking-tighter uppercase mb-1">VELOCITY RAIL</h1>
            <p className="font-label-caps text-label-caps text-[#d4c0d7]">Nexus-1 Protocol Interface</p>
          </div>

          {/* Biometric Placeholder */}
          <div className="relative w-32 h-32 mb-8 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <span className="material-symbols-outlined text-[#ebb2ff] text-6xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 200" }}>fingerprint</span>
            {/* Scanner Animation Placeholder */}
            <div className="scan-line shadow-[0_0_15px_#ebb2ff]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#ebb2ff]/10 to-transparent"></div>
          </div>

          {/* Warning Label */}
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-[#ffb4ab] neon-glow-red tracking-widest text-center">AUTHORIZED ACCESS ONLY</p>
          </div>

          {/* Input Fields */}
          <form className="w-full space-y-6">
            <div className="relative">
              <label className="font-label-caps text-label-caps text-[#d4c0d7] block mb-2 px-1">ADMIN ID</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8ba0] group-focus-within:text-[#ebb2ff] transition-colors">badge</span>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[#e5e2e3] font-data-mono text-data-mono focus:ring-2 focus:ring-[#ebb2ff]/50 focus:border-[#ebb2ff] outline-none transition-all placeholder:text-white/10"
                  placeholder="ENTER SECURE ID"
                  type="text"
                />
              </div>
            </div>

            <div className="relative">
              <label className="font-label-caps text-label-caps text-[#d4c0d7] block mb-2 px-1">NEXUS KEY</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8ba0] group-focus-within:text-[#ebb2ff] transition-colors">key_visualizer</span>
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[#e5e2e3] font-data-mono text-data-mono focus:ring-2 focus:ring-[#ebb2ff]/50 focus:border-[#ebb2ff] outline-none transition-all placeholder:text-white/10"
                  placeholder="••••••••••••"
                  type="password"
                />
              </div>
            </div>

            {/* Primary Action */}
            <button
              className="w-full bg-[#bc13fe] text-white font-headline-md text-body-base py-4 rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_35px_rgba(188,19,254,0.6)] active:scale-95 transition-all duration-300 uppercase tracking-widest mt-4"
              type="submit"
            >
              Initialize Uplink
            </button>
          </form>

          {/* Footer Details */}
          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[#9d8ba0]">
              <span className="material-symbols-outlined text-[14px]">security</span>
              <p className="font-data-mono text-[10px] tracking-tight">ENCRYPTION LEVEL: AES-512 QUANTUM</p>
            </div>
            <p className="font-data-mono text-[10px] text-white/20">SYSTEM NODE: VR-CENTRAL-09</p>
          </div>
        </div>

        {/* System Status Bar */}
        <div className="mt-6 flex justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#00e46b] shadow-[0_0_8px_#00e46b] animate-pulse"></div>
            <span className="font-label-caps text-[10px] text-[#00e46b]">CORE ONLINE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-caps text-[10px] text-[#d4c0d7]">V3.4.2-STABLE</span>
          </div>
        </div>
      </main>

      {/* Decorative Corner Elements */}
      <div className="fixed bottom-8 left-8 border-l border-b border-white/10 w-24 h-24 pointer-events-none"></div>
      <div className="fixed top-8 right-8 border-r border-t border-white/10 w-24 h-24 pointer-events-none"></div>
    </div>
  )
}

export default AdminLogin
