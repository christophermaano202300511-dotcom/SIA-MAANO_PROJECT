const express = require("express");
const app = express();

// ✅ FIX 1: Use dynamic port (important for Render)
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ FIX 2: Root route (prevents "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Job Board API is running 🚀");
});

// -------------------- DATA --------------------
let jobs = [];
let applications = [];

let jobIdCounter = 1;
let appIdCounter = 1;

// -------------------- JOB ROUTES --------------------

// Get all jobs
app.get("/jobs", (req, res) => {
  res.json(jobs);
});

// Get single job
app.get("/jobs/:id", (req, res) => {
  const id = Number(req.params.id);

  const job = jobs.find(j => j.id === id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  res.json(job);
});

// Create job
app.post("/jobs", (req, res) => {
  const { title, company, location } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newJob = {
    id: jobIdCounter++,
    title,
    company,
    location
  };

  jobs.push(newJob);

  res.status(201).json({
    message: "Job created successfully",
    job: newJob
  });
});

// -------------------- APPLICATION ROUTES --------------------

// Apply to job
app.post("/apply/:jobId", (req, res) => {
  const jobId = Number(req.params.jobId);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newApplication = {
    id: appIdCounter++,
    jobId,
    name,
    email
  };

  applications.push(newApplication);

  res.status(201).json({
    message: "Application submitted",
    application: newApplication
  });
});

// Get applications for a job
app.get("/jobs/:id/applications", (req, res) => {
  const jobId = Number(req.params.id);

  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ message: "Job not found" });

  const result = applications.filter(app => app.jobId === jobId);

  res.json(result);
});

// -------------------- SERVER --------------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});