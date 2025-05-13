require("dotenv").config();

const express = require("express");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const path = require("path");

const connection = require("./config/Database");

const errorHandler = require("./middleware/error");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const hackathonApplicationRoutes = require("./routes/hackathonApplicationRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const roundResponseRoutes = require("./routes/roundResponse");
const profileRoutes = require("./routes/profileRoutes");
const evaluateRoutes = require("./routes/Evaluate");

// Initialize app
const app = express();

// Connect to MongoDB
connection();

// Body parser middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/verifications", verificationRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/hackathon-applications", hackathonApplicationRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/round-responses", roundResponseRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/evaluate", evaluateRoutes);

// Base route for API status check
app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
        version: "1.0.0"
    });
});

// Error handling middleware
app.use(errorHandler);

// Handle unhandled routes
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});  
