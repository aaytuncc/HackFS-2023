# Project README

Welcome to our project! This document will guide you through the setup process and explain the structure of the repository. Before you proceed, please ensure you have Docker, Bacalhau, Webpack, and Node installed on your machine.

## Repository Structure

This repository is structured into three main directories: `backend`, `frontend`, and `image`.

- **Image**: Contains the Dockerfile and Python script for building the Docker image responsible for finding pools with the highest APY value. 
- **Backend**: Contains the server code which primarily runs Bacalhau tasks as cron jobs in a decentralized cloud environment.
- **Frontend**: Houses the user interface code for our product.

## Docker Image Build and Deployment

Navigate to the `image` directory to build the Docker image using the following command:

\`\`\`bash
docker buildx build --platform linux/amd64 --push -t <dockerhub-id>/<image-name> .
\`\`\`

Replace `<dockerhub-id>` and `<image-name>` with your DockerHub ID and the desired name for your image. Once the image is built, it can be deployed within the Bacalhau decentralized network.

## Solidity Contract and Push Protocol Channel

We've created a simple Solidity contract (`BestPoolFinder` as an example) and deployed it on the FVM calibration network. Additionally, we've established a channel within the Push Protocol staging environment (`test-push-protocol` as an example).

## Backend Setup

To setup the backend, navigate to the `backend` directory. Install the necessary dependencies using the following command:

\`\`\`bash
npm install
\`\`\`

Start the backend server with:

\`\`\`bash
node script.js
\`\`\`

We've included a `.env` file with private keys for testing, since the contract is only writable by us.

## Frontend Setup

To setup the frontend, navigate to the `frontend` directory. Install the necessary dependencies and start the frontend server with:

\`\`\`bash
npm install
node server.js
\`\`\`

After these steps, open `localhost:3000` in your web browser to see our product in action.

That's it! You have successfully set up and started the application. Enjoy exploring our project! For any further queries or issues, feel free to reach out.
