import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="mt-5 py-3 bg-body-tertiary">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-body">© 2025 Student Risk Assessment System</p>
            <p className="mb-0">
              <a href="https://github.com/SavichArtem" target="_blank" rel="noopener noreferrer" className="link-body-emphasis">
                GitHub
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;