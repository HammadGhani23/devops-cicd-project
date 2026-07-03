# DevOps CI/CD Project

A Node.js Express application containerized and deployed automatically using a complete CI/CD pipeline. The pipeline automates the testing, building, pushing, and deployment of the application container to an AWS EC2 instance.

## Architecture

```
GitHub push ──> GitHub Actions
                  ├──> test
                  ├──> build & push Docker image to Docker Hub
                  └──> SSH deploy to EC2 ──> App running on EC2 port 3000
```

![Architecture Diagram](docs/architecture.png)

## Tools Used

- **Git** for version control
- **Docker** for containerization
- **Docker Hub** as the container image registry
- **GitHub Actions** for CI/CD automation
- **AWS EC2** for hosting the live application

## Setup Instructions

### Running Locally
To run the Node.js Express application locally without Docker:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the application:
   ```bash
   npm start
   ```
The app will run at `http://localhost:3000`.

### Building and Running Docker Locally
To build and run the application container on your local machine:
1. Build the Docker image:
   ```bash
   docker build -t devops-cicd-project .
   ```
2. Run the Docker container mapping port 3000:
   ```bash
   docker run -d -p 3000:3000 --name devops-app devops-cicd-project
   ```

### CI/CD Deployment
The CI/CD pipeline is configured to automatically trigger whenever a push is made to the `main` branch:
1. **Test Job**: Runs `npm ci` and verifies the codebase.
2. **Build & Push Job**: Logs into Docker Hub, builds the production-ready Docker image, and pushes it with the tag `latest`.
3. **Deploy Job**: Connects to the AWS EC2 VM using SSH, pulls the latest image, removes the old container, and starts the updated container with port 3000 exposed and restart policy configured.

## Live Demo

You can view the live application status here:
http://13.51.238.181:3000/health

## Screenshots

<!-- TODO: Add application and pipeline screenshots manually -->
