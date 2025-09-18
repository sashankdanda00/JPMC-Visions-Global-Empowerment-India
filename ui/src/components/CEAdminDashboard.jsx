import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const CEAdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/students")
      .then(res => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        else if (Array.isArray(data.students)) setStudents(data.students);
        else setStudents([]);
        setLoading(false);
      })
      .catch(err => {
        setError("Could not load students. " + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{
      padding: "2.5rem",
      maxWidth: "1000px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ marginBottom: "1.3rem", color: "#1a237e" }}>CE Admin Dashboard</h2>
      <button
        style={{
          marginBottom: "1.5rem",
          padding: "10px 24px",
          background: "#1565c0",
          color: "#fff",
          borderRadius: "7px",
          fontSize: "1.1rem",
          border: "none",
          cursor: "pointer"
        }}
        onClick={() => navigate("/add-student")}
      >
        ➕ Add Student
      </button>
      <div style={{
        marginTop: "2rem",
        background: "#F4F6F9",
        borderRadius: "10px",
        padding: "1rem 2rem"
      }}>
        <h3 style={{ color: "#0d47a1", marginBottom: "1rem" }}>Enrolled Students</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : students.length === 0 ? (
          <p>No students enrolled yet.</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            marginTop: "0.5rem",
            fontSize: "1rem"
          }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Grade</th>
                <th style={thStyle}>School</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr
                  key={stu._id}
                  style={{ cursor: "pointer" }}
                  onMouseOver={e => e.currentTarget.style.background = "#e3f2fd"}
                  onMouseOut={e => e.currentTarget.style.background = ""}
                >
                  <td>
                    <Link
                      to={`/student/${stu._id}`}
                      style={linkStyle}
                    >
                      {stu.name}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/student/${stu._id}`}
                      style={linkStyle}
                    >
                      {stu.grade}
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/student/${stu._id}`}
                      style={linkStyle}
                    >
                      {stu.school_name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "10px",
  background: "#e3f2fd",
  borderBottom: "2px solid #90caf9",
  textAlign: "left"
};
const linkStyle = {
  textDecoration: "none",
  color: "#1976D2",
  fontWeight: "bold",
  display: "block",
  width: "100%"
};

export default CEAdminDashboard;
