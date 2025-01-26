FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy app files
COPY package*.json ./
RUN npm install
COPY . .

# Expose the app's port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
