import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./database/dbconnection.js";
import studentRoutes from "./routes/studentRoutes.js";


dotenv.config();


connectDB();

const app = express();

import cors from "cors";
import adminRouter from "./routes/adminRouter.js";
app.use(cors());

app.use(bodyParser.json());

app.use("/students", studentRoutes);

app.use("/admin", adminRouter); // Serve locations static files

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
