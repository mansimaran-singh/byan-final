import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "byan_secret_key_123";
const SKIP_DB = process.env.SKIP_DB === "true";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, companyName, companyDescription, cin, gst, pan } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (SKIP_DB) {
      const token = jwt.sign({ userId: "mock_user", role }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        message: "User registered (demo)",
        token,
        user: {
          id: "mock_user",
          name,
          email: normalizedEmail,
          role,
          companyName,
          pan
        }
      });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      companyName,
      companyDescription,
      cin,
      gst,
      pan
    });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        pan: user.pan
      }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (SKIP_DB) {
      const normalizedEmail = email.trim().toLowerCase();
      const token = jwt.sign({ userId: "mock_user", role: "recruiter" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        message: "Login successful (demo)",
        token,
        user: {
          id: "mock_user",
          name: normalizedEmail.split("@")[0],
          email: normalizedEmail,
          role: "recruiter",
          companyName: "Demo Corp"
        }
      });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
