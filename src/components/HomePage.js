import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import mainImage from '../assets/study.webp';
import FeaturesSection from './FeaturesSection';
import GettingStarted from './GettingStarted';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';

function HomePage({ user, onShowLogin }) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) {
      navigate('/students');
    } else {
      onShowLogin();
    }
  };

  return (
    <div className="home-page">
      <section className="py-5 bg-body">
        <Container className="py-4 py-lg-5">
          <Row className="align-items-center g-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Анализ риска отчисления студентов
              </h1>
              <p className="lead mb-4 fs-4">
                Наша система помогает преподавателям выявлять студентов с риском отчисления
                на основе их успеваемости, посещаемости и других факторов.
              </p>
              <Button variant="primary" size="lg" onClick={handleStart}className="px-4 py-3 fw-bold">
                Начать анализ
              </Button>
            </Col>
            <Col lg={6}>
              <img src={mainImage} alt="Студенты за обучением" className="img-fluid rounded-3 shadow-lg"/>
            </Col>
          </Row>
        </Container>
      </section>

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <GettingStarted user={user} onShowLogin={onShowLogin} />
    </div>
  );
}

export default HomePage;