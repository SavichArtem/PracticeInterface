import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { fetchUsers, updateUser } from './api';
import { validateField, isFormValid } from './validation';

function UserProfile({ user, show, onHide, onUpdate }) {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    phoneOrEmail: "",
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    phoneOrEmail: false,
    fullName: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && user) {
      const fetchUserData = async () => {
        try {
          const users = await fetchUsers();
          const currentUser = users.find(u => u.username === user.username);
          if (currentUser) {
            setFormData({
              phoneOrEmail: currentUser.phoneOrEmail || "",
              fullName: currentUser.fullName || "",
              username: currentUser.username || "",
              password: "",
              confirmPassword: "",
            });
          }
        } catch (err) {
          console.error("Ошибка загрузки данных пользователя:", err);
        }
      };
      fetchUserData();
    }
  }, [show, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, formData),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === 'password' || key === 'confirmPassword') {
        if (formData[key]) {
          newErrors[key] = validateField(key, formData[key], formData);
        }
      } else {
        newErrors[key] = validateField(key, formData[key], formData);
      }
    });
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const users = await fetchUsers();
      const currentUser = users.find(u => u.username === user.username);
      
      if (!currentUser) {
        setError("Пользователь не найден");
        setIsSubmitting(false);
        return;
      }

      const updatedUser = {
        ...currentUser,
        username: formData.username,
        fullName: formData.fullName,
        phoneOrEmail: formData.phoneOrEmail,
      };

      if (formData.password) {
        updatedUser.password = formData.password;
      }

      const response = await updateUser(currentUser.id, updatedUser);

      if (response.ok) {
        setSuccess("Данные успешно обновлены");
        onUpdate({
          username: updatedUser.username,
          role: updatedUser.role,
        });
        setTimeout(() => {
          onHide();
          setIsSubmitting(false);
          window.location.reload();
        }, 1500);
      } else {
        setError("Ошибка при обновлении данных");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Ошибка при обновлении данных");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Профиль пользователя</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>ФИО</Form.Label>
            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.fullName && !!errors.fullName}/>
            <Form.Control.Feedback type="invalid">
              {errors.fullName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.username && !!errors.username}/>
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Телефон или Email</Form.Label>
            <Form.Control type="text" name="phoneOrEmail" value={formData.phoneOrEmail} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.phoneOrEmail && !!errors.phoneOrEmail}/>
            <Form.Control.Feedback type="invalid">
              {errors.phoneOrEmail}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Новый пароль (оставьте пустым, если не хотите менять)</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.password && !!errors.password}/>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Подтверждение нового пароля</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.confirmPassword && !!errors.confirmPassword}/>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100">
            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UserProfile;