import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const SUBJECTS = [
  "maths",
  "english",
  "social_science",
  "science",
  "general_knowledge",
  "hindi"
];
const TERMS = ["Term-1", "Quarterly", "Half-yearly", "Yearly"];

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    aadhar_number: "",
    school_name: "",
    centre: "",
    grade: "",
    email: "",
    caste: "",
    father_details: {
      father_name: "",
      father_phone: "",
      father_occupation: ""
    },
    mother_details: {
      mother_name: "",
      mother_phone: "",
      mother_occupation: ""
    },
    marks: {}
  });
  const [currentField, setCurrentField] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Auto-fill on end of dictation
  useEffect(() => {
    if (!listening && currentField && transcript) {
      setFormData(prev => {
        const newData = { ...prev };
        const keys = currentField.split(".");
        let ref = newData;
        while (keys.length > 1) {
          const key = keys.shift();
          ref[key] = ref[key] || {};
          ref = ref[key];
        }
        ref[keys[0]] = transcript;
        return newData;
      });
      setCurrentField(null);
      resetTranscript();
    }
    // eslint-disable-next-line
  }, [listening]);

  const handleVoiceInput = (fieldPath) => {
    setCurrentField(fieldPath);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleChange = (e, fieldPath) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = fieldPath.split(".");
      let ref = newData;
      while (keys.length > 1) {
        const key = keys.shift();
        ref[key] = ref[key] || {};
        ref = ref[key];
      }
      ref[keys[0]] = value;
      return newData;
    });
  };

  // ---- Fixes the React key warning by allowing a key prop
  const renderInput = (label, fieldPath, type = "text", keyVal = null) => {
    const keys = fieldPath.split(".");
    let value = formData;
    for (let key of keys) {
      value = value?.[key] ?? "";
    }
    return (
      <div className="form-group" key={keyVal || fieldPath}>
        <label>{label}</label>
        <div className="input-wrapper">
          <input
            type={type}
            name={fieldPath}
            value={value}
            onChange={(e) => handleChange(e, fieldPath)}
          />
          <button type="button" onClick={() => handleVoiceInput(fieldPath)} title="Start voice input">
            🎤
          </button>
          {listening && currentField === fieldPath && (
            <span style={{marginLeft: 6, fontSize: "1.1em", color: "#38b6ff"}}>Listening...</span>
          )}
        </div>
      </div>
    );
  };

  // <<<<---------- SUBMIT HANDLER THAT POSTS DATA --------->>>>
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || "Failed to add student");
      }
      setSuccess("Student added successfully!");
      setFormData({
        name: "",
        gender: "",
        aadhar_number: "",
        school_name: "",
        centre: "",
        grade: "",
        email: "",
        caste: "",
        father_details: {
          father_name: "",
          father_phone: "",
          father_occupation: ""
        },
        mother_details: {
          mother_name: "",
          mother_phone: "",
          mother_occupation: ""
        },
        marks: {}
      });
      // --- To auto-redirect to dashboard, uncomment the next line ---
      // navigate("/ce-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="student-form-container">
      <form onSubmit={handleSubmit} className="student-form">
        <h2>Student Info</h2>
        {success && <div style={{color: "green", fontWeight: "bold"}}>{success}</div>}
        {error && <div style={{color: "red", fontWeight: "bold"}}>{error}</div>}
        {renderInput("Name", "name")}
        {renderInput("Gender", "gender")}
        {renderInput("Aadhar Number", "aadhar_number")}
        {renderInput("School Name", "school_name")}
        {renderInput("Centre", "centre")}
        {renderInput("Grade", "grade")}
        {renderInput("Email", "email")}
        {renderInput("Caste", "caste")}
        <h2>Father's Details</h2>
        {renderInput("Father Name", "father_details.father_name")}
        {renderInput("Father Phone", "father_details.father_phone")}
        {renderInput("Father Occupation", "father_details.father_occupation")}
        <h2>Mother's Details</h2>
        {renderInput("Mother Name", "mother_details.mother_name")}
        {renderInput("Mother Phone", "mother_details.mother_phone")}
        {renderInput("Mother Occupation", "mother_details.mother_occupation")}
        <h2>Marks</h2>
        {TERMS.map(term => (
          <div key={term} className="term-section">
            <h3>{term}</h3>
            {SUBJECTS.map(subject =>
              renderInput(
                `${subject.replace(/_/g, " ")} (${term})`,
                `marks.${term}.${subject}`,
                "number",
                term + subject // unique key
              )
            )}
          </div>
        ))}
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      {/* Embedded CSS */}
      <style>{`
        * { box-sizing: border-box; }
        .student-form-container {
          min-height: 100vh;
          background: #F4F6F9;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .student-form {
          width: 100%;
          max-width: 900px;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        input[type="text"],
        input[type="number"],
        input[type="email"] {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          background: #fafdff;
        }
        .input-wrapper button {
          background: #e3f6fc;
          color: #00394f;
          border: 1px solid #bde0fe;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          font-size: 1.2rem;
          margin-left: 3px;
        }
        .input-wrapper button:hover {
          background: #a5d8fa;
        }
        .term-section {
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          background-color: #FAFAFA;
        }
        .term-section h3 {
          margin-top: 0;
        }
        .submit-btn {
          background-color: #007BFF;
          color: white;
          font-weight: bold;
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: #0056B3;
        }
        h2 {
          margin-top: 2rem;
          color: #333;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default StudentForm;
