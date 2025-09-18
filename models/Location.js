
import mongoose from "mongoose";
const locationSchema = new mongoose.Schema({
  locationName:{
    type: String,
    required: true
  }
})
export const Location = mongoose.model("Location", locationSchema);
