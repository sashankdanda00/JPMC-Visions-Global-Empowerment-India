import mongoose from "mongoose";

// --- Subject marks schema (per term, no _id) ---
const subjectMarksSchema = new mongoose.Schema({
  maths: { type: Number, min: 0, max: 100, default: 0 },
  english: { type: Number, min: 0, max: 100, default: 0 },
  social_science: { type: Number, min: 0, max: 100, default: 0 },
  science: { type: Number, min: 0, max: 100, default: 0 },
  general_knowledge: { type: Number, min: 0, max: 100, default: 0 },
  hindi: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: false });

// --- Term-wise marks schema (all terms, no _id) ---
const marksSchema = new mongoose.Schema({
  "Term-1": { type: subjectMarksSchema, required: false },
  "Quarterly": { type: subjectMarksSchema, required: false },
  "Half-yearly": { type: subjectMarksSchema, required: false },
  "Yearly": { type: subjectMarksSchema, required: false }
}, { _id: false });

// --- Main student schema ---
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Student name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Other"]
  },
  aadhar_number: {
    type: String,
    required: [true, "Aadhar number is required"],
    match: [/^\d{12}$/, "Aadhar number must be exactly 12 digits"],
    unique: true
  },
  school_name: {
    type: String,
    required: [true, "School name is required"],
    trim: true,
    maxlength: [100, "School name cannot exceed 100 characters"]
  },
  centre: {
    type: String,
    required: [true, "Centre is required"],
    trim: true,
    maxlength: [50, "Centre name cannot exceed 50 characters"]
  },
  grade: {
    type: String,
    required: [true, "Grade is required"],
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  marks: {
    type: marksSchema,
    required: false
  },
  father_details: {
    father_name: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
      maxlength: [50, "Father's name cannot exceed 50 characters"]
    },
    father_phone: {
      type: String,
      required: [true, "Father's phone is required"],
      match: [/^\d{10}$/, "Father's phone must be 10 digits"]
    },
    father_occupation: {
      type: String,
      required: [true, "Father's occupation is required"],
      trim: true,
      maxlength: [50, "Father's occupation cannot exceed 50 characters"]
    }
  },
  mother_details: {
    mother_name: {
      type: String,
      required: [true, "Mother's name is required"],
      trim: true,
      maxlength: [50, "Mother's name cannot exceed 50 characters"]
    },
    mother_phone: {
      type: String,
      required: [true, "Mother's phone is required"],
      match: [/^\d{10}$/, "Mother's phone must be 10 digits"]
    },
    mother_occupation: {
      type: String,
      required: [true, "Mother's occupation is required"],
      trim: true,
      maxlength: [50, "Mother's occupation cannot exceed 50 characters"]
    }
  },
  caste: {
    type: String,
    required: [true, "Caste is required"],
    enum: ["General", "OBC", "SC", "ST", "Other"]
  },
  student_id: {
    type: String,
    unique: true,
    default: function () {
      return `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
  },
  total_marks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Graduated"],
    default: "Active"
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- Virtuals (auto-calculated on Yearly marks) ---
studentSchema.virtual('calculatedTotal').get(function () {
  if (!this.marks || !this.marks["Yearly"]) return 0;
  const yearly = this.marks["Yearly"];
  return (yearly.maths || 0) +
    (yearly.english || 0) +
    (yearly.social_science || 0) +
    (yearly.science || 0) +
    (yearly.general_knowledge || 0) +
    (yearly.hindi || 0);
});

studentSchema.virtual('calculatedPercentage').get(function () {
  const total = this.calculatedTotal;
  return ((total / 600) * 100).toFixed(2);
});

// --- Pre-save: update total_marks and percentage before saving ---
studentSchema.pre('save', function (next) {
  this.total_marks = this.calculatedTotal;
  this.percentage = this.calculatedPercentage;
  next();
});

// --- Indexes for quick lookup ---
studentSchema.index({ student_id: 1 });
studentSchema.index({ school_name: 1, grade: 1 });
studentSchema.index({ centre: 1 });

// --- Model export ---
const Student = mongoose.model("Student", studentSchema);
export default Student;
