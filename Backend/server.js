require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connection = require("./config/Database");
const errorHandler = require("./middleware/error");
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

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
const teamMatchingRoutes = require("./routes/teamMatchingRoutes");
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Make io accessible globally
global.io = io;

// Socket.IO middleware for authentication
io.use((socket, next) => {
    console.log('\n=== Socket Authentication Attempt ===');
    if (socket.handshake.auth && socket.handshake.auth.token) {
        console.log('Token received in handshake');
        jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT verification failed:', err);
                return next(new Error('Authentication error'));
            }
            console.log('JWT verified successfully');
            console.log('User ID from token:', decoded.id);
            socket.userId = decoded.id;
            next();
        });
    } else {
        console.error('No token provided in handshake');
        next(new Error('Authentication error'));
    }
});


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('\n=== New Socket Connection ===');
    console.log('Socket ID:', socket.id);
    console.log('User ID:', socket.userId);

    // Join a room with the user's ID for private notifications
    socket.join(socket.userId);
    console.log('User joined room:', socket.userId);

    // Log current rooms for this socket
    console.log('Socket rooms:', Array.from(socket.rooms));

    // Log all connected users
    console.log('\nCurrently connected users:');
    io.sockets.sockets.forEach((s, id) => {
        console.log(`Socket ID: ${id}, User ID: ${s.userId}`);
    });

    socket.on('error', (error) => {
        console.error('Socket error for user', socket.userId, ':', error);
    });

    socket.on('disconnect', () => {
        console.log('\n=== Socket Disconnection ===');
        console.log('User disconnected - Socket ID:', socket.id);
        console.log('User ID:', socket.userId);
    });
});

// Connect to MongoDB
connection();

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use("/api/team-matching", teamMatchingRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);

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
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});  
