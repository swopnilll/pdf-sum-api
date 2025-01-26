FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including nodemon for development
RUN npm install

# Copy the rest of the app files
COPY . .

# Expose the app's port
EXPOSE 3000

# Use nodemon to run the app in development mode (this allows auto-reloading)
CMD ["npm", "run", "dev"]
