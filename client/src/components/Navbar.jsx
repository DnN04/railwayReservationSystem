import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const navigate  = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const path = location.pathname

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  let navLinks = []
  if (isAdmin) {
    navLinks = [
      { label: 'Dashboard',    to: '/admin' },
      { label: 'All Bookings', to: '/admin' },
    ]
  } else if (user) {
    navLinks = [
      { label: 'Network',  to: '/dashboard' },
      { label: 'Search',     to: '/search' },
      { label: 'About',      to: '/about' },
      { label: 'My Tickets', to: '/tickets' },
    ]
  } else {
    navLinks = [
      { label: 'Home',       to: '/' },
      { label: 'Network',  to: '/dashboard' },
      { label: 'Search',     to: '/search' },
      { label: 'About',      to: '/about' },
    ]
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-black/70 backdrop-blur-md font-['Space_Grotesk'] tracking-tight rounded-2xl mt-6 mx-auto w-[92%] max-w-7xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]">
      <Link to={isAdmin ? '/admin' : '/'} className="text-2xl font-black tracking-tighter text-fuchsia-500 uppercase">
        RAIL BANDHU
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={
              path === link.to
                ? 'text-fuchsia-500 font-bold border-b-2 border-fuchsia-500 pb-1'
                : 'text-slate-400 font-medium hover:text-fuchsia-300 hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-lg'
            }
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden md:block text-slate-400 text-sm font-data-mono">
              {user.name}
              {isAdmin && (
                <span className="ml-2 px-2 py-0.5 bg-fuchsia-600/20 border border-fuchsia-600/40 rounded-full text-fuchsia-400 text-[10px] font-label-caps">ADMIN</span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white/5 border border-white/10 text-slate-300 px-5 py-2 rounded-full font-bold text-sm hover:bg-red-600/20 hover:border-red-500/40 hover:text-red-400 transition-all active:scale-95"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-[#bc13fe] text-white px-6 py-2 rounded-full font-bold tracking-tight active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(188,19,254,0.5)]"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
