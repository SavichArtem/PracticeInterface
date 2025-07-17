import 'bootstrap/dist/css/bootstrap.min.css';
import NaviBar from './components/Navibar';
import StudentForm from './components/StudentForm';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { fetchUsers } from './components/api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('user');

  const checkUserRole = async (username) => {
    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      const currentUser = users.find(u => u.username === username);
      return currentUser?.role || 'user';
    } catch (error) {
      console.error('Ошибка проверки роли:', error);
      return 'user';
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      checkUserRole(parsedUser.username).then(userRole => {
        setRole(userRole);
      });
    }
  }, []);

  const handleLogin = async (userData) => {
    const userRole = await checkUserRole(userData.username);
    const users = await fetchUsers();
    const currentUser = users.find(u => u.username === userData.username);
    
    const userWithRole = {
      ...currentUser,
      role: userRole
    };
    
    setUser({
      username: userWithRole.username,
      role: userWithRole.role
    });
    
    localStorage.setItem('user', JSON.stringify({
      username: userWithRole.username,
      role: userWithRole.role
    }));
  };

  const handleLogout = () => {
    setUser(null);
    setRole('user');
    localStorage.removeItem('user');
  };

  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NaviBar user={user} onLogin={handleLogin} onLogout={handleLogout} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" 
              element={
                <HomePage user={user} onShowLogin={() => document.getElementById('login-button').click()} />
              } 
            />
            <Route path="/students" 
              element={
                <ProtectedRoute>
                  <StudentForm role={role} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;