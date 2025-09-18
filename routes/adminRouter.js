import { Router } from "express";
import { Location } from "../models/Location.js";
import CeModel from "../models/ceModel.js";
import Students from "../models/Student.js"; // Assuming you have a Student model
const adminRouter = Router();
adminRouter.post("/login", (req, res) => {
    const {name, password} = req.body;
    if (name === "admin" && password === "admin") {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
adminRouter.post("/add-location", async (req, res) => {
    const { locationName } = req.body;
    if (!locationName) {
        return res.status(400).json({ message: "locationName is required" });
    }
    // Optional: check for duplicates
    const exists = await Location.findOne({ locationName });
    if (exists) {
        return res.status(409).json({ message: "Location already exists" });
    }
    const newLocation = new Location({ locationName });
    await newLocation.save();
    return res.status(201).json({
        message: "Location added successfully",
        location: newLocation,
    });
});

adminRouter.get("/get-all-locations", async (req, res) => {
    try {
        const locations= await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
adminRouter.get("/get-average-marks-by-location-and-grade", async (req, res) => {
    const { location } = req.body;
    try {
        const result = await Students.aggregate([
            { $match: { location: location } },
            { $unwind: "$grades" },
            {
                $group: {
                    _id: { grade: "$grades.grade", subject: "$grades.subject" },
                    averageMarks: { $avg: "$grades.marks" }
                }
            },
            {
                $group: {
                    _id: "$_id.grade",
                    subjects: {
                        $push: {
                            subject: "$_id.subject",
                            averageMarks: "$averageMarks"
                        }
                    }
                }
            }
        ]);
        if (result.length === 0) {
            return res.status(404).json({ message: "No data found for this location" });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.post("/add-ce", async (req, res) => { 
  try {
    const { name, email, age, qualification, phone, gender, locationName } = req.body;
    if (!name || !email || !age || !qualification || !phone || !gender || !locationName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Save CE
    const newCE = new CeModel({ name, email, age, qualification, phone, gender, locationName });
    await newCE.save();
    // Add location if not exists
    let location = await Location.findOne({ locationName });
    if (!location) {
      location = new Location({ locationName });
      await location.save();
    }
    res.status(201).json({ message: "CE added successfully", ce: newCE });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







export default adminRouter;