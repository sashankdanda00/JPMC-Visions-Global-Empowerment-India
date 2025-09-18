const searchForm = document.getElementById("searchForm");
const studentIdInput = document.getElementById("studentId");
const studentDetailsDiv = document.getElementById("studentDetails");
const chartSection = document.getElementById("chartSection");
const subjectSelect = document.getElementById("subjectSelect");

let chartInstance = null;
let currentStudent = null;

searchForm.onsubmit = async function(e) {
  e.preventDefault();
  const id = studentIdInput.value.trim();
  studentDetailsDiv.textContent = "";
  chartSection.style.display = "none";
  if (!id) return;

  try {
    const res = await fetch(`http://localhost:3000/students/${id}`);
    if (!res.ok) throw new Error("Student not found");
    const student = await res.json();
    currentStudent = student;

    // Display student basic info
    studentDetailsDiv.innerHTML = `
      <b>Name:</b> ${student.name || "-"} <br>
      <b>Grade:</b> ${student.grade || "-"} <br>
      <b>Review:</b> ${student.review || "-"}
    `;

    // Get subjects from first available term with marks
    const terms = ["Term-1", "Quarterly", "Half-yearly", "Yearly"];
    let subjects = [];
    for (const term of terms) {
      if (student.marks && student.marks[term]) {
        subjects = Object.keys(student.marks[term]);
        break;
      }
    }
    if (!subjects.length) {
      studentDetailsDiv.innerHTML += "<br><b>No marks found for this student.</b>";
      return;
    }

    // Populate subject dropdown
    subjectSelect.innerHTML = "";
    for (const sub of subjects) {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      subjectSelect.appendChild(opt);
    }

    chartSection.style.display = "block";
    plotChart(student, subjectSelect.value);

  } catch (err) {
    studentDetailsDiv.textContent = "Error: " + err.message;
    chartSection.style.display = "none";
  }
};

subjectSelect.onchange = function() {
  if (currentStudent) plotChart(currentStudent, subjectSelect.value);
};

function plotChart(student, subject) {
  const ctx = document.getElementById("marksChart").getContext("2d");
  const terms = ["Term-1", "Quarterly", "Half-yearly", "Yearly"];
  const marks = terms.map(term => 
    student.marks && student.marks[term] && typeof student.marks[term][subject] === "number"
      ? student.marks[term][subject]
      : null
  );

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: terms,
      datasets: [{
        label: `Marks in ${subject.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
        data: marks,
        fill: false,
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 100,
          title: { display: true, text: "Marks" }
        }
      }
    }
  });
}
