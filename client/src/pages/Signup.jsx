import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/Navbar'

function Signup() {
  const navigate  = useNavigate()
  const { login } = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center font-body-base text-on-surface relative overflow-hidden" style={{
      backgroundColor: '#050505',
      backgroundImage: 'radial-gradient(at 0% 0%, rgba(188,19,254,0.15) 0px,transparent 50%),radial-gradient(at 100% 100%, rgba(0,245,255,0.1) 0px,transparent 50%)'
    }}>
      <Navbar />

      <div className="w-full max-w-md px-6 mt-20">
        <div className="border border-white/10 rounded-2xl p-10 flex flex-col gap-6" style={{ backdropFilter: 'blur(20px)', background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.2) 100%)' }}>

          <div className="text-center">
            <h1 className="font-headline-md text-headline-md text-white mb-1">Create Account</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant">Join the Velocity Rail network</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'name',     label: 'FULL NAME',    type: 'text',     icon: 'person',          placeholder: 'Your name' },
              { name: 'email',    label: 'EMAIL',         type: 'email',    icon: 'alternate_email',  placeholder: 'you@example.com' },
              { name: 'password', label: 'PASSWORD',      type: 'password', icon: 'lock_open',        placeholder: '••••••••' },
            ].map(({ name, label, type, icon, placeholder }) => (
              <div key={name}>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2">{label}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#504254]">{icon}</span>
                  <input name={name} type={type} value={form[name]} onChange={handleChange} required
                    className="w-full bg-[#0e0e0f] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#bc13fe] focus:ring-1 focus:ring-[#bc13fe] transition-all placeholder:text-[#504254]"
                    placeholder={placeholder} />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-[#bc13fe] hover:bg-[#9800d0] text-white font-label-caps py-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(188,19,254,0.6)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Creating account...</>
              ) : (
                <>Initialize Uplink <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center font-body-base text-data-mono text-on-surface-variant">
            Already have access?
            <Link className="text-[#bc13fe] font-semibold hover:underline underline-offset-4 ml-1" to="/login">Sign In</Link>
          </p>
        </div>
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#bc13fe]/10 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00f4fe]/5 blur-[100px] rounded-full -z-10"></div>
    </div>
  )
}

export default Signup
