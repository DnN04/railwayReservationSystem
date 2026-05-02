import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'

function Login() {
  const navigate   = useNavigate()
  const { login }  = useAuth()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body-base text-on-surface" style={{
      backgroundColor: 'transparent',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(188,19,254,0.15) 0px,transparent 50%),radial-gradient(at 100% 100%, rgba(0,245,255,0.1) 0px,transparent 50%)'
    }}>
      <Navbar />

      {/* Left visual */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwaSEN9WgiN46AzjeMOy-twmPWvBLeHlb_PFs9PoXwMNTbh1KcKvn17do5xm7UtdZF4Cvcu3VMkYHDbhKA0f7hj09wi2Lotugd8ZlrVB9-9GgJ7wIZst5QCmDQDmHlLmLfUAIuxoI3UfDYAGmXqrpHolFyq2hTrqmcXn2zx8uiYE82nyb80J3vni6NKIIKaabSVkxawHZnjTx_BIeJcNH2vKR2qYKR7gjKMHw2XwG2xUAfK_HwV1qnBKNizCka96Sk_9QX8eT2Bb8"
            alt="Kinetic train" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display-lg text-display-lg text-white mb-6 uppercase tracking-tighter">
            Rail Bandhu <br /><span className="text-[#bc13fe]">Redefined.</span>
          </h1>
          <p className="text-on-surface-variant font-body-base mb-8 max-w-md">
            Experience the nexus of heavy infrastructure and premium software agility. Command your journey with surgical precision.
          </p>
          <div className="flex gap-6">
            <div className="border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined text-[#00e46b]">speed</span>
              <span className="font-data-mono text-white">650 KM/H</span>
            </div>
            <div className="border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.05)' }}>
              <span className="material-symbols-outlined text-[#63f7ff]">bolt</span>
              <span className="font-data-mono text-white">ZERO EMISSIONS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Right: form */}
      <section className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative mt-20 md:mt-0 z-10">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="font-headline-md text-headline-md text-white">Secure Portal</h2>
            <p className="text-on-surface-variant font-body-base">Enter your credentials to access Rail Command.</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm font-body-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">Network ID / Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#504254]">alternate_email</span>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full bg-[#0e0e0f] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder:text-[#504254]"
                    placeholder="nexus.agent@railbandhu.in" />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-end mb-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant">Access Key</label>
                  <a className="text-[10px] font-label-caps text-[#9d8ba0] hover:text-white transition-colors" href="#">Lost Credentials?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#504254]">lock_open</span>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required
                    className="w-full bg-[#0e0e0f] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder:text-[#504254]"
                    placeholder="••••••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#bc13fe] hover:bg-[#9800d0] text-white font-label-caps py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(188,19,254,0.6)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Authenticating...</>
              ) : (
                <>Initialize Session <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="font-body-base text-data-mono text-on-surface-variant">
              New operative?
              <Link className="text-[#bc13fe] font-semibold hover:underline underline-offset-4 ml-1" to="/signup">Create Account</Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 flex gap-8">
          <span className="font-label-caps text-[10px] text-[#504254]">SYSTEM v.4.0.2</span>
          <span className="font-label-caps text-[10px] text-[#504254]">ENCRYPTED NEXUS</span>
        </div>
      </section>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#bc13fe]/10 blur-[120px] rounded-full z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00f4fe]/5 blur-[100px] rounded-full z-[-1]"></div>
    </div>
  )
}

export default Login
