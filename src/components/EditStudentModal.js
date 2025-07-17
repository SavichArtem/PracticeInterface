import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const EditStudentModal = ({ 
  student, 
  courses, 
  groups, 
  studyTypes, 
  activities, 
  onSave, 
  onClose 
}) => {
  const [editedStudent, setEditedStudent] = useState(student);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (student) {
      setEditedStudent({
        ...student,
        debts: student.debts.toString(),
        gpa: student.gpa.toString(),
        passes: student.passes.toString()
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const processedStudent = {
        ...editedStudent,
        debts: editedStudent.debts === '' ? '0' : editedStudent.debts,
        gpa: editedStudent.gpa === '' ? '0' : editedStudent.gpa,
        passes: editedStudent.passes === '' ? '0' : editedStudent.passes
      };

      const response = await fetch(`http://localhost:3001/students/${processedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...processedStudent,
          debts: parseInt(processedStudent.debts),
          gpa: parseFloat(processedStudent.gpa),
          passes: parseInt(processedStudent.passes)
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при обновлении');
      }
      
      const savedStudent = await response.json();
      onSave(savedStudent);
      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Ошибка обновления:', error);
    }
  };

  return (
    <Modal show={!!student} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Редактирование студента</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>ФИО</Form.Label>
              <Form.Control type="text" name="name" value={editedStudent?.name || ''} onChange={handleChange} required/>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Курс</Form.Label>
              <Form.Select name="course" value={editedStudent?.course || ''} onChange={handleChange} required>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Группа</Form.Label>
              <Form.Select name="group" value={editedStudent?.group || ''} onChange={handleChange} required>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Форма обучения</Form.Label>
              <Form.Select name="studyType" value={editedStudent?.studyType || ''} onChange={handleChange} required>
                {studyTypes.map(t => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Активность</Form.Label>
              <Form.Select name="activity" value={editedStudent?.activity || ''} onChange={handleChange} required>
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
              <Form.Control type="number" name="debts" value={editedStudent?.debts || '0'} onChange={handleChange} min="0" required/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Средний балл (GPA)</Form.Label>
              <Form.Control type="number" name="gpa" value={editedStudent?.gpa || '0'} onChange={handleChange} min="1" max="5" step="0.1" required/>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Пропуски</Form.Label>
              <Form.Control type="number" name="passes" value={editedStudent?.passes || '0'} onChange={handleChange} min="0" required/>
            </Form.Group>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onClose} className="me-2">Отмена</Button>
            <Button variant="primary" type="submit">Сохранить изменения</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditStudentModal;