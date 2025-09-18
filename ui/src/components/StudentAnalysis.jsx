import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const TERMS = ["Term-1", "Quarterly", "Half-yearly", "Yearly"];
const COLORS = [
  "#3274d9", "#ef476f", "#ffd166", "#06d6a0", "#8e44ad", "#f67280"
];

const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
  background: "#f7fafc",
  boxSizing: "border-box",
  padding: "2.5em 2vw",
  color: "#232a32",
};

const detailsStyle = {
  marginBottom: "2em",
  fontSize: "1.15em",
  background: "#fff",
  padding: "2.5em 2vw",
  borderRadius: 14,
  boxShadow: "0 1px 6px #d8e7fb55",
  width: "100%",
  color: "#232a32",
};

const sectionTitle = {
  fontSize: "1.35em",
  fontWeight: 700,
  color: "#1651b6",
  margin: "1.2em 0 0.7em 0",
  display: "block",
  width: "100%",
  letterSpacing: 0.5,
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "2em",
  width: "100%",
};

const parentCard = {
  background: "#f1f7ff",
  borderRadius: 10,
  padding: "1em 1.5em",
  marginBottom: "1em",
  color: "#232a32",
};

const errorStyle = {
  color: "#d72727",
  marginBottom: "1em",
  fontWeight: 500,
};

const chartContainerStyle = {
  marginTop: "2em",
  background: "#f9fbfe",
  padding: "2em 1em 2em 1em",
  borderRadius: 12,
  boxShadow: "0 1px 6px #d8e7fb44",
  width: "100%",
  overflow: "hidden",
  color: "#232a32",
};

const inputStyle = {
  margin: "0 1em",
  padding: "0.7em",
  borderRadius: 8,
  border: "1px solid #8cb9fc",
  background: "#e8f1fd",
  minWidth: "200px",
  flex: "1",
  color: "#232a32",
};

const labelStyle = {
  marginRight: "0.5em",
  fontWeight: 500,
  whiteSpace: "nowrap",
  color: "#232a32",
};

const StudentAnalysis = () => {
  const { id } = useParams(); // URL: /student/:id
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const [isSingleTerm, setIsSingleTerm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setError("");
    setStudent(null);
    setSubjects([]);
    setSelectedSubject("");
    setIsSingleTerm(false);
    fetch(`http://localhost:3000/students/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Student not found");
        return res.json();
      })
      .then(data => {
        if (data && data.student) {
          setStudent(data.student);

          // Priority 1: Use marks (multi-term)
          let foundMarks = false;
          let subs = [];
          for (const term of TERMS) {
            if (data.student.marks && data.student.marks[term]) {
              subs = Object.keys(data.student.marks[term]);
              foundMarks = true;
              break;
            }
          }
          if (foundMarks && subs.length) {
            setSubjects(subs);
            setSelectedSubject(subs[0]);
            setIsSingleTerm(false);
          } else if (data.student.subjects) {
            // Fallback: Use single-term 'subjects'
            const subNames = Object.keys(data.student.subjects);
            setSubjects(subNames);
            setSelectedSubject(subNames[0]);
            setIsSingleTerm(true);
          }
        } else {
          setError("No student data received");
        }
      })
      .catch(err => setError(err.message));
  }, [id]);

  // Chart data logic for both schemas
  const chartData = () => {
    if (!student || !selectedSubject) return null;
    if (isSingleTerm && student.subjects) {
      // Single-term subjects (show as bar/flat line)
      return {
        labels: [selectedSubject.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())],
        datasets: [
          {
            label: selectedSubject.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            data: [student.subjects[selectedSubject]],
            fill: false,
            borderColor: COLORS[0],
            backgroundColor: COLORS[0],
            tension: 0.2,
            pointRadius: 8,
            pointHoverRadius: 10,
          }
        ]
      };
    } else {
      // Multi-term marks
      const marks = TERMS.map(term =>
        student.marks && student.marks[term] && typeof student.marks[term][selectedSubject] === "number"
          ? student.marks[term][selectedSubject]
          : null
      );
      if (marks.every(v => v === null)) return null;
      return {
        labels: TERMS,
        datasets: [
          {
            label: selectedSubject.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            data: marks,
            fill: false,
            borderColor: COLORS[0],
            backgroundColor: COLORS[0],
            tension: 0.2,
            pointRadius: 5,
            pointHoverRadius: 8,
          }
        ]
      };
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        title: { display: true, text: "Marks" },
      },
    },
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%" }}>
        <h2 style={{
          color: "#3274d9",
          letterSpacing: 1,
          marginBottom: 24,
          fontSize: "2.7em",
          textAlign: "left",
          width: "100%"
        }}>
          📈 Student Academic Analysis
        </h2>
        {error && <div style={errorStyle}>Error: {error}</div>}
        {student && (
          <>
            <div style={detailsStyle}>
              <span style={sectionTitle}>📝 Basic Details</span>
              <div style={twoCol}>
                <div>
                  <p><b>Name:</b> {student.name || "-"}</p>
                  <p><b>Gender:</b> {student.gender || "-"}</p>
                  <p><b>Student ID:</b> {student.student_id || student._id || "-"}</p>
                  <p><b>Grade:</b> {student.grade || "-"}</p>
                  <p><b>Status:</b> {student.status || "-"}</p>
                  <p><b>Caste:</b> {student.caste || "-"}</p>
                </div>
                <div>
                  <p><b>School:</b> {student.school_name || "-"}</p>
                  <p><b>Centre:</b> {student.centre || "-"}</p>
                  <p><b>Total Marks:</b> {student.total_marks ? `${student.total_marks}/600` : "-"}</p>
                  <p><b>Percentage:</b> {student.percentage ? `${student.percentage}%` : "-"}</p>
                </div>
              </div>
              <span style={sectionTitle}>👪 Parent Details</span>
              <div style={twoCol}>
                <div style={parentCard}>
                  <h4 style={{ color: "#2a5298", margin: "0 0 0.7em 0" }}>Father</h4>
                  <p><strong>Name:</strong> {student.father_details?.father_name || student.father_name || "-"}</p>
                  <p><strong>Phone:</strong> {student.father_details?.father_phone || student.father_phone || "-"}</p>
                  <p><strong>Occupation:</strong> {student.father_details?.father_occupation || student.father_occupation || "-"}</p>
                </div>
                <div style={parentCard}>
                  <h4 style={{ color: "#2a5298", margin: "0 0 0.7em 0" }}>Mother</h4>
                  <p><strong>Name:</strong> {student.mother_details?.mother_name || student.mother_name || "-"}</p>
                  <p><strong>Phone:</strong> {student.mother_details?.mother_phone || student.mother_phone || "-"}</p>
                  <p><strong>Occupation:</strong> {student.mother_details?.mother_occupation || student.mother_occupation || "-"}</p>
                </div>
              </div>
            </div>
            <div style={{ margin: "2.2em 0", width: "100%" }}>
              <span style={sectionTitle}>📊 Subject-wise Performance Across Terms</span>
              {subjects.length ? (
                <div style={{ marginBottom: "1em", display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1em" }}>
                  <label htmlFor="subjectSelect" style={labelStyle}>Select Subject:</label>
                  <select
                    id="subjectSelect"
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    style={inputStyle}
                  >
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>
                        {sub.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {selectedSubject && chartData() && (
                <div style={chartContainerStyle}>
                  <Line ref={chartRef} data={chartData()} options={chartOptions} />
                </div>
              )}
              {selectedSubject && !chartData() && (
                <div style={{ padding: "2em", textAlign: "center", background: "#fff", borderRadius: 12 }}>
                  <b>No marks found for this subject.</b>
                </div>
              )}
              {!subjects.length && (
                <div style={{ padding: "2em", textAlign: "center", background: "#fff", borderRadius: 12 }}>
                  <b>No marks found for this student.</b>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentAnalysis;
