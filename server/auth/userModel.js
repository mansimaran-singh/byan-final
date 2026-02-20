import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "recruiter"], default: "student" },
    
    // Recruiter specific fields
    companyName: { type: String },
    companyDescription: { type: String },
    cin: { type: String },
    gst: { type: String },
    pan: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
