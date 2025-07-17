import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function GettingStarted({ user, onShowLogin }) {
  const navigate = useNavigate();
  const steps = [
    {
      icon: 'bi-person-check',
      title: "Регистрация",
      text: "Создайте аккаунт"
    },
    {
      icon: 'bi-upload',
      title: "Загрузка данных",
      text: "Импортируйте данные студентов"
    },
    {
      icon: 'bi-bar-chart',
      title: "Анализ",
      text: "Получайте автоматические отчеты и рекомендации"
    }
  ];

  const handleStart = () => {
    if (user) {
      navigate('/students');
    } else {
      onShowLogin();
    }
  };

  return (
    <section className="py-5 bg-body">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-3">Как начать работу?</h2>
            <p className="lead text-body-secondary">Всего 3 простых шага до первого анализа</p>
          </Col>
        </Row>

        <Row className="g-4">
          {steps.map((step, index) => (
            <Col md={4} key={index}>
              <div className="p-4 h-100 bg-body-secondary rounded-3 shadow-sm border-start border-5 border-primary">
                <i className={`bi ${step.icon} text-primary fs-3 mb-3`}></i>
                <h3 className="h4">{step.title}</h3>
                <p className="text-body-secondary">{step.text}</p>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <Button variant="primary" size="lg" className="px-4"onClick={handleStart}>
            Начать работу
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default GettingStarted;