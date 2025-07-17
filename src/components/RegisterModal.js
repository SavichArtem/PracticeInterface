import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { validateField, isFormValid } from "./validation";
import { registerUser, checkUserExists } from "./api";

function RegisterModal({ show, onHide, onLogin }) {
  const [formData, setFormData] = useState({
    phoneOrEmail: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    phoneOrEmail: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
  });

  const [touched, setTouched] = useState({
    phoneOrEmail: false,
    password: false,
    confirmPassword: false,
    fullName: false,
    username: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setFormData({
        phoneOrEmail: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        username: "",
      });
      setErrors({
        phoneOrEmail: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        username: "",
      });
      setTouched({
        phoneOrEmail: false,
        password: false,
        confirmPassword: false,
        fullName: false,
        username: false,
      });
      setError("");
      setSuccess("");
    }
  }, [show]);

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

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    if ((name === 'username' || name === 'phoneOrEmail') && !error) {
      const exists = await checkUserExists(name, value);
      if (exists) {
        setErrors((prev) => ({
          ...prev,
          [name]: name === 'username' 
            ? 'Это имя пользователя уже занято' 
            : 'Этот телефон или email уже используется',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      newErrors[key] = validateField(key, formData[key], formData);
    });
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const usernameExists = await checkUserExists('username', formData.username);
      const contactExists = await checkUserExists('phoneOrEmail', formData.phoneOrEmail);

      if (usernameExists) {
        setError("Пользователь с таким именем уже существует");
        setIsSubmitting(false);
        return;
      }

      if (contactExists) {
        setError("Этот телефон или email уже используется");
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        phoneOrEmail: formData.phoneOrEmail,
        role: "user",
      };

      const response = await registerUser(newUser);

      if (response.ok) {
        onLogin({
          username: newUser.username,
          role: newUser.role,
        });

        setSuccess("Регистрация прошла успешно! Вы автоматически вошли в систему.");

        setTimeout(() => {
          onHide();
          setIsSubmitting(false);
          window.location.reload();
        }, 1500);
      } else {
        setError("Ошибка при регистрации");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Ошибка при регистрации");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Регистрация</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Телефон или Email</Form.Label>
            <Form.Control type="text" name="phoneOrEmail" value={formData.phoneOrEmail} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.phoneOrEmail && !!errors.phoneOrEmail}/>
            <Form.Control.Feedback type="invalid">
              {errors.phoneOrEmail}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.password && !!errors.password}/>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Подтверждение пароля</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.confirmPassword && !!errors.confirmPassword}/>
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ФИО</Form.Label>
            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.fullName && !!errors.fullName}/>
            <Form.Text className="text-muted">
              Введите Фамилию и Имя (Отчество - по желанию)
            </Form.Text>
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

          <Button variant="primary" type="submit" disabled={isSubmitting || !isFormValid(errors)} className="w-100">
            {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RegisterModal;