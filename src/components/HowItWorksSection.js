import React from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import reportExample from '../assets/example.png';

function HowItWorksSection() {
  const steps = [
    "Загрузите данные об успеваемости студентов",
    "Система автоматически проанализирует показатели",
    "Получите отчет с оценкой риска отчисления",
    "Примите меры для студентов из группы риска"
  ];

  return (
    <section className="py-5">
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6}>
            <h2 className="mb-4">Как это работает?</h2>
            <ListGroup variant="flush" className="border-0">
              {steps.map((step, index) => (
                <ListGroup.Item key={index} className="border-0 py-3 bg-transparent px-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '36px', height: '36px', flexShrink: 0}}>
                      {index + 1}
                    </div>
                    <span className="flex-grow-1 text-body">{step}</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={6}>
            <div className="p-4 rounded shadow-sm bg-body border border-1 border-primary-subtle">
              <h4 className="text-center mb-4">Пример отчета</h4>
              <div className="d-flex justify-content-center align-items-center bg-body-tertiary rounded" 
                   style={{minHeight: '250px', overflow: 'hidden'}}>
                <img src={reportExample} alt="Пример визуализации отчета" className="img-contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}/>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HowItWorksSection;