import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { fetchUsers } from './api';

function LoginModal({ show, onHide, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  try {
    const users = await fetchUsers();
    const user = users.find(u => 
      u.username === username && u.password === password
    );
    
    if (user) {
      onLogin({
        id: user.id,
        username: user.username,
        role: user.role || 'user',
        phoneOrEmail: user.phoneOrEmail,
        fullName: user.fullName
      });
      onHide();
      window.location.reload();
    } else {
      setError('Неверное имя пользователя или пароль');
    }
  } catch (err) {
    setError('Ошибка при входе в систему');
    console.error(err);
  }
};

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Вход в систему</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control  type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit">Войти</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;