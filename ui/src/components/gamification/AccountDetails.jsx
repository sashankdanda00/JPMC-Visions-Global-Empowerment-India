import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AccountDetails.css';

const AccountDetails = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = ""; // Replace with dynamic ID if needed

  useEffect(() => {
    axios.get(`/api/student/${studentId}`)
      .then(res => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching student data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading student data...</p>;
  if (!student) return <p>Unable to load student details.</p>;

  return (
    <div className="account-section">
      <h2>👤 Student Account Overview</h2>
      <div className="account-card">
        <p><strong>Name:</strong> {student.name || "-"}</p>
        <p><strong>Gender:</strong> {student.gender || "-"}</p>
        <p><strong>Student ID:</strong> {student.student_id || "-"}</p>
        <p><strong>Grade:</strong> {student.grade || "-"}</p>
        <p><strong>School:</strong> {student.school_name || "-"}</p>
        <p><strong>Centre:</strong> {student.centre || "-"}</p>
        <p><strong>Status:</strong> {student.status || "-"}</p>
        <p><strong>Caste:</strong> {student.caste || "-"}</p>
        <p><strong>Total Marks:</strong> {student.total_marks ? `${student.total_marks}/600` : "-"}</p>
        <p><strong>Percentage:</strong> {student.percentage ? `${student.percentage}%` : "-"}</p>
      </div>

      <h3>👪 Parent Details</h3>
      <div className="parent-section">
        <div>
          <h4>Father</h4>
          <p><strong>Name:</strong> {student.father_name || "-"}</p>
          <p><strong>Phone:</strong> {student.father_phone || "-"}</p>
          <p><strong>Occupation:</strong> {student.father_occupation || "-"}</p>
        </div>
        <div>
          <h4>Mother</h4>
          <p><strong>Name:</strong> {student.mother_name || "-"}</p>
          <p><strong>Phone:</strong> {student.mother_phone || "-"}</p>
          <p><strong>Occupation:</strong> {student.mother_occupation || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
