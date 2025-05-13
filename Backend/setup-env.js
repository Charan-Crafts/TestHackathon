/**
 * Setup script for environment variables and application config
 * Run this with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

console.log('Starting environment setup...');

// Create .env file with proper JWT configuration
const envContent = `
# JWT Configuration
JWT_SECRET=hackathon_secure_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (update as needed)
MONGO_URI=mongodb://localhost:27017/hackathon

# Client URL for CORS
CLIENT_URL=http://localhost:3000
`;

try {
    fs.writeFileSync(path.join(__dirname, '.env'), envContent.trim());
    console.log('✅ Created .env file with JWT configuration');
} catch (err) {
    console.error('❌ Error creating .env file:', err.message);
}

console.log('\nSetup complete. You can now restart your server.');
console.log('If you still have issues with registration, try using a stronger password (not email)'); 