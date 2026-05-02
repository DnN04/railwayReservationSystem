import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import Home           from './pages/Home'
import Login          from './pages/Login'
import Signup         from './pages/Signup'
import Booking        from './pages/Booking'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin     from './pages/AdminLogin'
import MyTickets      from './pages/MyTickets'
import SearchResults  from './pages/SearchResults'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/search"      element={<SearchResults />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected — any logged-in user */}
        <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />

        {/* Protected — admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
