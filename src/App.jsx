import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './components/Products';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import ScrollToTop from './components/ScrollToTop';

// Security Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col">
        
        {/* 1. Navbar is ALWAYS at the top */}
        <Navbar />
        
        {/* 2. Main Content expands to fill space */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>

        {/* 3. Footer is ALWAYS at the bottom */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;