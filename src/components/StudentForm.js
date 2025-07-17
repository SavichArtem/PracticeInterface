import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentCard from './StudentCard';
import EditStudentModal from './EditStudentModal';

function StudentForm({role}) {

  const nameRegex = /^[А-ЯЁ][а-яё]*(?:-[А-ЯЁ][а-яё]*)?\s[А-ЯЁ][а-яё]*(?:\s[А-ЯЁ][а-яё]*(?:-[А-ЯЁ][а-яё]*)?)?$/;

  const courses = ['1', '2', '3', '4'];
  const groups = ['ПИР-231', 'АСОИР-231', 'ПИР-221', 'АСОИР-221'];
  const studyTypes = [
    { value: 'budget', label: 'Бюджет' },
    { value: 'paid', label: 'Платно' }
  ];
  const activities = [
    { value: 'high', label: 'Высокая' },
    { value: 'medium', label: 'Средняя' },
    { value: 'low', label: 'Низкая' }
  ];

  const [student, setStudent] = useState({
    name: '',
    course: '1',
    group: groups[0],
    studyType: 'budget',
    debts: '0',
    gpa: '4.0',
    passes: '0',
    activity: 'medium'
  });
  

  const [studentsList, setStudentsList] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [error, setError] = useState(null);
  const [nameError, setNameError] = useState('');

  const validateName = (name) => {
    if (!nameRegex.test(name)) {
      setNameError('Введите ФИО в формате: "Фамилия Имя Отчество" (отчество необязательно)');
      return false;
    }
    setNameError('');
    return true;
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/students');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        setStudentsList(data);
      } catch (error) {
        setError(error.message);
        console.error('Ошибка загрузки студентов:', error);
      }
    };
    loadStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      validateName(value);
    }
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(student.name)) {
      return;
    }

    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...student,
          debts: parseInt(student.debts),
          gpa: parseFloat(student.gpa),
          passes: parseInt(student.passes)
        }),
      });
      
      if (!response.ok) throw new Error('Ошибка при сохранении');
      
      const createdStudent = await response.json();
      setStudentsList([...studentsList, createdStudent]);
      
      setStudent({
        name: '',
        course: '1',
        group: groups[0],
        studyType: 'budget',
        debts: '0',
        gpa: '4.0',
        passes: '0',
        activity: 'medium'
      });
    } catch (error) {
      setError(error.message);
      console.error('Ошибка сохранения:', error);
    }
  };

  const handleSaveEdit = (updatedStudent) => {
  setStudentsList(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  setEditingStudent(null);
};

  const getRisk = (s) => {
    const debts = parseInt(s.debts);
    const gpa = parseFloat(s.gpa);
    const passes = parseInt(s.passes);
    const isPaid = s.studyType === 'paid';
    const isLowActivity = s.activity === 'low';

    if (gpa < 2.0 || passes > 30 || (debts > 2 && isPaid)) return 'высокий';
    if (debts > 0 || gpa < 3.0 || passes > 15 || (isPaid && gpa < 3.5) || (isLowActivity && passes > 5)) return 'средний';
    return 'низкий';
  };

  const getRecommendations = (s) => {
    const recommendations = [];
    const debts = parseInt(s.debts);
    const gpa = parseFloat(s.gpa);
    const passes = parseInt(s.passes);
    const isPaid = s.studyType === 'paid';
    const isLowActivity = s.activity === 'low';

    if (gpa < 2.0) recommendations.push('Срочно повысить успеваемость');
    if (passes > 30) recommendations.push('Критическое количество пропусков');
    if (debts > 2 && isPaid) recommendations.push('Много долгов для платного обучения');
    if (debts > 0) recommendations.push(`Закрыть ${debts} ${debts === 1 ? 'долг' : 'долга(ов)'}`);
    if (gpa < 3.0) recommendations.push('Обратиться за помощью к преподавателю');
    if (passes > 15) recommendations.push('Улучшить посещаемость');
    if (isPaid && gpa < 3.5) recommendations.push('Повысить успеваемость для платного обучения');
    if (isLowActivity && passes > 5) recommendations.push('Повысить активность и посещаемость');
    if (isLowActivity) recommendations.push('Проявить больше активности');
    if (recommendations.length === 0) recommendations.push('Рекомендации не требуются');

    return recommendations;
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'высокий': return 'danger';
      case 'средний': return 'warning';
      case 'низкий': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mt-4">
      {role === 'admin' && (
        <>
        <h2 className="mb-4">Форма студента</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>ФИО</Form.Label>
            <Form.Control type="text" name="name" value={student.name} onChange={handleChange} required placeholder="Введите полное имя" isInvalid={!!nameError}/>
            <Form.Control.Feedback type="invalid">
                  {nameError}
                </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Курс</Form.Label>
            <Form.Select name="course" value={student.course} onChange={handleChange} required>
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Группа</Form.Label>
            <Form.Select name="group" value={student.group} onChange={handleChange} required>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Форма обучения</Form.Label>
            <Form.Select name="studyType" value={student.studyType} onChange={handleChange} required>
              {studyTypes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Активность</Form.Label>
            <Form.Select name="activity" value={student.activity} onChange={handleChange} required>
              {activities.map(a => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Долги</Form.Label>
            <Form.Control type="number" name="debts" value={student.debts} onChange={handleChange} min="0" required placeholder="0"/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Средний балл (GPA)</Form.Label>
            <Form.Control type="number" name="gpa" value={student.gpa} onChange={handleChange} min="1" max="5" step="0.1" required placeholder="4.0"/>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Пропуски</Form.Label>
            <Form.Control type="number" name="passes" value={student.passes} onChange={handleChange} min="0" required placeholder="0"/>
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">Добавить студента</Button>
      </Form>
        </>
      )}

<div className="mt-5">
        <h3>Список студентов</h3>
        <Row xs={1} md={2} lg={3} className="g-4">
          {studentsList.map(s => (
            <Col key={s.id}>
              <StudentCard
                student={s}
                studyTypes={studyTypes}
                activities={activities}
                getRisk={getRisk}
                getRecommendations={getRecommendations}
                getRiskColor={getRiskColor}
                onEdit={setEditingStudent}
                setStudentsList={setStudentsList}
                role={role}/>
            </Col>
          ))}
        </Row>
      </div>

      <EditStudentModal 
      student={editingStudent} 
      courses={courses} 
      groups={groups} 
      studyTypes={studyTypes} 
      activities={activities} 
      onClose={() => setEditingStudent(null)}
      onSave={handleSaveEdit}
      setStudentsList={setStudentsList}/>
    </div>
  );
}

export default StudentForm;