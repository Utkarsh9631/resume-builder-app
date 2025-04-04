const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Define Resume Schema with reference to User
const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalDetails: {
    name: String,
    email: String,
    phone: String,
    linkedin: String,
    github: String,
    leetcode: String
  },
  education: {
    school10: String,
    passout10: {
      type: String, // Explicitly define as String with validation
      validate: {
        validator: function(v) {
          return true; // Accept any string format
        },
        message: props => `${props.value} is not a valid date format!`
      }
    },
    school12: String,
    passout12: {
      type: String, // Explicitly define as String with validation
      validate: {
        validator: function(v) {
          return true; // Accept any string format
        },
        message: props => `${props.value} is not a valid date format!`
      }
    },
    college: String,
    graduationYear: {
      type: String, // Explicitly define as String with validation
      validate: {
        validator: function(v) {
          return true; // Accept any string format 
        },
        message: props => `${props.value} is not a valid date format!`
      }
    }
  },
  workExperience: [{
    company: String,
    projectDescription: String,
    jobRole: String
  }],
  projects: [{
    description: String,
    url: String
  }],
  skills: [String],
  certifications: [{
    name: String,
    url: String
  }],
  jobTarget: {
    preferredRole: String,
    jobDescription: String
  }
}, { timestamps: true }); // Add timestamps for created/updated tracking

const Resume = mongoose.model("Resume", resumeSchema);

// 🔹 Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// 🔹 Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error logging in" });
  }
});

// 🔹 Middleware to Protect Routes
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  });
}

// 🔹 Get User Data (Protected Route)
app.get("/user", authenticateToken, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email });
});

// 🔹 Resume Routes 🔹

// Submit Resume (Protected Route)
app.post('/submit-resume', authenticateToken, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user._id // Associate with the logged-in user
    };

    const newResume = new Resume(resumeData);
    await newResume.save();
    res.status(201).json({ message: "Resume saved successfully!" });
  } catch (err) {
    console.error("Error saving resume:", err);
    res.status(500).json({ error: "Error saving resume" });
  }
});

// Get all resumes for the logged-in user
app.get('/user-resumes', authenticateToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id });
    res.json(resumes);
  } catch (err) {
    console.error("Error fetching resumes:", err);
    res.status(500).json({ error: "Error fetching resumes" });
  }
});

// Get a specific resume by ID
app.get('/resume/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id // Ensure the user owns this resume
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ error: "Error fetching resume" });
  }
});

// Update a specific resume
app.put('/resume/:id', authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id // Ensure the user owns this resume
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Update resume data
    Object.assign(resume, req.body);
    await resume.save();

    res.json({ message: "Resume updated successfully" });
  } catch (err) {
    console.error("Error updating resume:", err);
    res.status(500).json({ error: "Error updating resume" });
  }
});

// Delete a specific resume
app.delete('/resume/:id', authenticateToken, async (req, res) => {
  try {
    const result = await Resume.deleteOne({
      _id: req.params.id,
      userId: req.user._id // Ensure the user owns this resume
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    console.error("Error deleting resume:", err);
    res.status(500).json({ error: "Error deleting resume" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
