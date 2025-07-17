import React, { useRef } from 'react';
import { Container, Carousel, Card } from 'react-bootstrap';

function TestimonialsSection() {
  const carouselRef = useRef(null);
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  const testimonials = [
    {
      name: "Иванова А.П.",
      position: "Декан факультета",
      text: "Система помогла нам снизить процент отчислений на 15% за первый семестр использования."
    },
    {
      name: "Петров С.И.",
      position: "Преподаватель",
      text: "Теперь я могу заранее видеть, какие студенты нуждаются в дополнительной помощи."
    },
    {
      name: "Сидорова М.В.",
      position: "Куратор группы",
      text: "Удобный интерфейс и точные прогнозы. Рекомендую всем коллегам!"
    }
  ];

  // Минимальное расстояние для свайпа
  const minSwipeDistance = 50; 

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && carouselRef.current) {
      carouselRef.current.next();
    }
    if (isRightSwipe && carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  return (
    <section className="py-5 bg-body-tertiary">
      <Container>
        <h2 className="text-center mb-5">Отзывы пользователей</h2>
        <Carousel 
          ref={carouselRef}
          indicators={false}
          interval={null} 
          prevIcon={
            <span aria-hidden="true" className="carousel-control-prev-icon bg-dark bg-opacity-75 rounded-circle p-3"/>
          }
          nextIcon={
            <span aria-hidden="true" className="carousel-control-next-icon bg-dark bg-opacity-75 rounded-circle p-3"/>
          }
          variant="dark"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {testimonials.map((item, index) => (
            <Carousel.Item key={index} className="pb-4">
              <div className="mx-auto" style={{ maxWidth: '800px', touchAction: 'pan-y' }}>
                <Card className="border border-2 border-primary">
                  <Card.Body className="p-5 text-center">
                    <blockquote className="blockquote mb-4">
                      <p className="lead fs-4">"{item.text}"</p>
                    </blockquote>
                    <footer className="blockquote-footer mt-4 fs-5">
                      <strong>{item.name}</strong>, {item.position}
                    </footer>
                  </Card.Body>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

export default TestimonialsSection;