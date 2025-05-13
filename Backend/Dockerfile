# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Remove any existing uploads directory and create a new one
RUN rm -rf uploads && mkdir uploads

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 