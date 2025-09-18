import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

// Add a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({student});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json({students});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({student});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;
