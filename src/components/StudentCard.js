import React, { useState } from 'react';
import { Card, Alert, Button, ButtonGroup } from 'react-bootstrap';

const StudentCard = ({ 
  student, 
  studyTypes, 
  activities, 
  getRisk, 
  getRecommendations, 
  getRiskColor,
  onEdit,
  setStudentsList,
  role
}) => {
  const [error, setError] = useState(null);
  const risk = getRisk(student);
  const recommendations = getRecommendations(student);
  const riskColor = getRiskColor(risk);

  const handleDelete = async () => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:3001/students/${student.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Ошибка при удалении');
      
      setStudentsList(prev => prev.filter(s => s.id !== student.id));
    } catch (error) {
      setError(error.message);
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Card.Title>{student.name || 'Не указано'}</Card.Title>
        <Card.Text>
          <strong>Курс:</strong> {student.course}<br />
          <strong>Группа:</strong> {student.group}<br />
          <strong>Форма обучения:</strong> {studyTypes.find(t => t.value === student.studyType)?.label || student.studyType}<br />
          <strong>Долги:</strong> {student.debts}<br />
          <strong>GPA:</strong> {student.gpa}<br />
          <strong>Пропуски:</strong> {student.passes}<br />
          <strong>Активность:</strong> {activities.find(a => a.value === student.activity)?.label || student.activity}
        </Card.Text>

        <Alert variant={riskColor} className="mt-3">
          <strong>Риск отчисления:</strong> {risk}
        </Alert>

        <div className="mt-3">
          <strong>Рекомендации:</strong>
          <ul className="mb-3">
            {recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        {role === 'admin' && (
        <ButtonGroup className="w-100">
          <Button variant="outline-primary" onClick={() => onEdit(student)}>Редактировать</Button>
          <Button variant="outline-danger" onClick={handleDelete}>Удалить</Button>
        </ButtonGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default StudentCard;