# Use an official Node runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 to the outside world (or any other port you want to use)
EXPOSE 3000

# Start the Node.js server when the container launches
CMD ["npm", "start"]
