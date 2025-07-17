import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function FeaturesSection() {
  const features = [
    {
      title: "Анализ данных",
      description: "Автоматический анализ успеваемости и посещаемости студентов"
    },
    {
      title: "Персонализация",
      description: "Индивидуальные рекомендации для каждого студента"
    },
    {
      title: "Своевременные уведомления",
      description: "Оповещения о критических изменениях в показателях"
    }
  ];

  return (
    <section className="py-5 bg-body-tertiary">
      <Container>
        <h2 className="text-center mb-5">Наши преимущества</h2>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={4} key={index}>
              <Card className="h-100 shadow-sm border border-1 border-primary-subtle bg-body">
                <Card.Body className="p-4 text-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" 
                       style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                    {index + 1}
                  </div>
                  <h3 className="mb-3">{feature.title}</h3>
                  <p className="text-body-secondary mb-0">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default FeaturesSection;