import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Progress.css';

const Progress = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = "STU172839123";

  useEffect(() => {
    axios.get(`/api/student/${studentId}`)
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching student progress:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading progress...</p>;
  if (!student) return <p>Progress data not available.</p>;

  return (
    <div className="progress-section">
      <h2>📈 Academic Progress</h2>
      <div className="progress-card">
        <p><strong>Total Marks:</strong> {student.total_marks} / 600</p>
        <p><strong>Percentage:</strong> {student.percentage}%</p>
        <div className="bar-wrapper">
          <div
            className="bar"
            style={{ width: `${student.percentage}%` }}
          >
            {student.percentage}%
          </div>
        </div>
      </div>

      <h3>📘 Subject-wise Performance</h3>
      <div className="subject-bars">
        {Object.entries(student.subjects).map(([subject, marks]) => (
          <div key={subject} className="subject-bar">
            <label>{subject.replace('_', ' ')} ({marks})</label>
            <div className="bar-wrapper">
              <div className="bar" style={{ width: `${marks}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;
