# Use a Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies, including devDependencies for build
RUN npm install --only=development

# Copy the rest of your application code into the container
COPY . .

# Build the NestJS app
RUN npm run build

# Remove devDependencies after build to keep image size small
RUN npm prune --production

# Expose the port for the application
EXPOSE 3000

# Run the NestJS application
CMD ["npm", "run", "start:prod"]