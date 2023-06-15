# Docker Image Creation and Testing

This guide assumes that you have Docker installed on your machine. Follow these steps to create and test a Docker image.

## Preparations

Make sure you are in the `poc` directory where the Dockerfile and `main.py` exist. 

Before you begin, ensure that you are logged into Docker Hub by using the command:
\`\`\`bash
docker login
\`\`\`

## Building the Docker Image

If you're already on a linux/amd64 machine, you can build the Docker image by running the following command:

\`\`\`bash
docker build . --tag dockerhub-id/image-name
\`\`\`

Replace `dockerhub-id/image-name` with your Docker Hub ID and the name you want for your image.

After successfully building the image, you can push it to Docker Hub with:

\`\`\`bash
docker push dockerhub-id/image-name
\`\`\`

For building multi-platform images, you can use `docker buildx` as follows:

\`\`\`bash
docker buildx build --platform linux/amd64 --push -t dockerhub-id/image-name .
\`\`\`

Replace `dockerhub-id/image-name` with your Docker Hub ID and the name you want for your image.

## Testing the Docker Image

Now navigate to the `test` directory. 

Here you can run the test script with:

\`\`\`bash
sh test.sh
\`\`\`

During testing, you'll need to provide your Docker image name and the desired URL.
