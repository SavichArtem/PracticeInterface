import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import UserProfile from './UserProfile';
import { useState, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';

export default function Navibar({ user, onLogin, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const loginButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileUpdate = (updatedUser) => {
    onLogin(updatedUser);
  };

  const handleStudentsClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLogin(true);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand as={Link} to="/">Вычисление риска отчисления студента</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              <Nav.Link as={Link} to="/students"onClick={handleStudentsClick}>
                Студенты
              </Nav.Link>
            </Nav>
            
            <Stack direction="horizontal" gap={2}>
              <ThemeToggle className="me-2" />
              {user ? (
                <>
                  <span className="navbar-text me-2">Привет, {user.username}</span>
                  <Button variant="outline-primary" onClick={() => setShowProfile(true)}>
                    Профиль
                  </Button>
                  <Button variant="outline-danger" onClick={onLogout}>Выйти</Button>
                </>
              ) : (
                <>
                  <Button id="login-button" ref={loginButtonRef}variant="outline-primary" onClick={() => setShowLogin(true)}>
                    Войти
                  </Button>
                  <Button variant="primary" onClick={() => setShowRegister(true)}>Зарегистрироваться</Button>
                </>
              )}
            </Stack>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onLogin={onLogin}/>
      <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} onLogin={onLogin}/>
      <UserProfile user={user} show={showProfile} onHide={() => setShowProfile(false)} onUpdate={handleProfileUpdate}/>
    </>
  );
}