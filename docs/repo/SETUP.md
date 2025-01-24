# Setup | Private Repository

This script sets up a private repository on Google Artifact Registry to host the Castro Agent Docker image. It includes instructions to build and push the Castro Agent to Google Artifact Registry and to pull and run the Castro Agent on the AI server.

## **Why?**

- **SECURITY**: We want to ensure that the Castro Agent Docker image is stored securely in a private **remote** repository to prevent unauthorized access.
- **RELIABILITY**: We want to ensure that the Castro Agent Docker image is privately available and accessible to the AI server for deployment and execution.
- **SCALABILITY**: We want to be able to reliably scale the deployment of the Castro Agent Docker image across multiple AI servers as needed.

- **MANAGEMENT**: We want to have a centralized location to store and manage the Castro Agent Docker image for deployment on the AI server.
- **VERSIONING**: We want to have version control over the Castro Agent Docker image to track changes and updates.
- **MONITORING**: We want to be able to monitor the deployment and execution of the Castro Agent Docker image on the AI server for performance and security.

## Installation Steps

To set up the private repository on Google Artifact Registry, we will need to perform the following steps:

1. **Enable Google Artifact Registry on the AI Server**: Enable Google Artifact Registry on the AI server to host the private repository for the Castro Agent Docker image.
2. **Install Docker on the AI Server**: Install Docker on the AI server to build, push, and run the Castro Agent Docker image.
3. **Install the Google Cloud SDK on the AI Server**: Install the Google Cloud SDK on the AI server to interact with Google Artifact Registry and other Google Cloud services.
4. **Build and Push the Castro Agent to Google Artifact Registry**: Create a Dockerfile for the Castro Agent, build the Docker image, and push it to Google Artifact Registry. **NOTE:** This is done from the local machine.

```bash

# Enable Google Artifact Registry on the AI server
gcloud services enable artifactregistry.googleapis.com

# Install Docker on the AI server
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add docker to the group to avoid using sudo docker
sudo groupadd docker
sudo usermod -aG docker user

# Install the Google Cloud SDK on the AI server
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get install -y apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt-get update && sudo apt-get install -y google-cloud-sdk

# Check if the service account has the correct scopes (try on local machine if necessary)
sudo gcloud compute instances describe app-server --zone=us-central1-a --format="get(serviceAccounts.scopes)"

# Stop the AI server from the local machine
gcloud compute instances stop app-server --zone=us-central1-a

# Set the service account scopes for the AI server
gcloud compute instances set-service-account app-server \
    --zone=us-central1-a \
    --scopes=https://www.googleapis.com/auth/cloud-platform

# Start the AI server from the local machine
gcloud compute instances start app-server --zone=us-central1-a

# The AI server should now have the correct scopes to access the Artifact Registry
sudo gcloud artifacts repositories create private-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Private Docker repository for hosting Castro artifacts" \
    --project=project-name

# Check the repository is created
sudo gcloud artifacts repositories list --location=us-central1

```

## **A. Build and Push the Castro Agent to Google Artifact Registry:**

To build and push the Castro Agent to Google Artifact Registry, we will need to create a Dockerfile in the local project directory. The Dockerfile will contain the necessary instructions to build the Castro Agent image. Once the Dockerfile is created, we can build and push the Castro Agent to Google Artifact Registry.

For multiplatform builds, we can use `docker buildx` to build the image for multiple platforms (e.g., `linux/amd64`, `linux/arm64`). This will allow us to run the Castro Agent on different architectures.

```bash

# Navigate to directory where Dockerfile is
docker buildx build --platform linux/amd64,linux/arm64 \
  -t us-central1-docker.pkg.dev/project-name/private-repo/app-image:latest \
  --push .

# Push the Docker image to Google Artifact Registry from the local machine
docker tag app-image:latest us-central1-docker.pkg.dev/project-name/private-repo/app-image:latest
gcloud auth configure-docker us-central1-docker.pkg.dev
docker push us-central1-docker.pkg.dev/project-name/private-repo/app-image:latest

```

## **B. Pull and Run the Castro Agent on the AI Server:**

To pull and run the Castro Agent on the AI server, we will need to install Docker on the AI server. Once Docker is installed, we can pull the Castro Agent image from Google Artifact Registry and run it on the AI server.

```bash

# Pull the Docker image from Google Artifact Registry on the AI server
sudo gcloud auth configure-docker us-central1-docker.pkg.dev
sudo docker pull us-central1-docker.pkg.dev/project-name/private-repo/app-image:latest
sudo docker run -d --name app-name us-central1-docker.pkg.dev/project-name/private-repo/app-image:latest
sudo docker start app-name

```

## TroubleShooting

Below are possible issues that may arise when setting up the private repository on the AI server.

### **A. Docker Command Not Found:**

If the `docker` command is not found, it may be due to the path not being set correctly. To fix this, add the path to the `.bashrc` file and source it.

```bash

which docker
# outputs: > /usr/bin/docker

# Does the .bashrc contain the path to the docker command?
cat /home/user/.bashrc

# If not found, add the path to the .bashrc file
sudo ls -l /home/user/.bashrc

# If the .bashrc file does not exist, create it
sudo touch /home/user/.bashrc
sudo chown user:user /home/user/.bashrc

# Add the path to the .bashrc file
echo 'export PATH=$PATH:/usr/bin' | sudo tee -a /home/user/.bashrc
sudo chown user:user /home/user/.bashrc

# Check if the path is added
cat /home/user/.bashrc

# Source the .bashrc file
source /home/user/.bashrc

```

### **B. Docker Group Permissions:**

If the user does not have permission to run Docker commands without `sudo`, it may be due to the user not being added to the `docker` group. To fix this, add the user to the `docker` group and log out and back in.

```bash

# Add the user to the docker group
sudo usermod -aG docker user

# Log out and log back in
exit

# Check if the user is in the docker group
groups

```

### **C. Google Cloud SDK Installation Issues:**

If there are issues installing the Google Cloud SDK on the AI server, it may be due to missing dependencies or incorrect installation steps. To fix this, follow the correct installation steps for the Google Cloud SDK.

```bash

# Install the Google Cloud SDK on the AI server
sudo apt-get install google-cloud-sdk

# If that does not work, try the following steps
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list

```

### **D. Service Account Scopes Issues:**

If the service account on the AI server does not have the correct scopes, it may be due to the service account not having the necessary permissions. To fix this, set the correct scopes for the service account on the AI server.

```bash

# Check if the service account has the correct scopes (try on local machine if necessary)
sudo gcloud compute instances describe app-server --zone=us-central1-a --format="get(serviceAccounts.scopes)"

# Set the service account scopes for the AI server
gcloud compute instances set-service-account app-server \
    --zone=us-central1-a \
    --scopes=https://www.googleapis.com/auth/cloud-platform

```

### **E. Google Artifact Registry Access Issues:**

If there are issues accessing Google Artifact Registry from the AI server, it may be due to authentication or network issues. To fix this, configure Docker to authenticate with Google Artifact Registry and check the network settings.

```bash

# Configure Docker to authenticate with Google Artifact Registry
sudo gcloud auth configure-docker us-central1-docker.pkg.dev

# Check the network settings on the AI server
sudo gcloud compute firewall-rules list

```

### **F. Docker Compose Issues:**

Since this is a multi-service architecture (Node server, Ollama), the built image will require the compose file to orchestrate the services. If there are issues with Docker Compose, it may be due to incorrect configuration or missing dependencies. To fix this, ensure that the Docker Compose file is correctly configured and that all dependencies are installed.

If you have shell access to the GCloud AI server (which you should), then use vim or nano (I like vim more) to create the `docker-compose.yml` file in the root directory of the project. Here is an example of a `docker-compose.yml` file that orchestrates the Castro and Ollama services:

```bash

services:
  castro:
    image: us-central1-docker.pkg.dev/app-name/private-repo/app-image:latest
    ports:
      - '3000:3000'  # Expose the app
    env_file:
      - .env
    depends_on:
      ollama:
        condition: service_healthy
    networks:
      - app-network

  ollama:
    image: ollama/ollama:latest
    ports:
      - '11434:11434'  # Expose Ollama API
    volumes:
      - ollama-models:/root/.ollama/models
    networks:
      - castro-network
    entrypoint: >
      /bin/bash -c "apt-get update && apt-get install -y curl && ollama serve & until curl -sf http://localhost:11434/api/ps; do sleep 1; done && ollama pull tinyllama && tail -f /dev/null"
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:11434/api/ps']
      interval: 10s
      retries: 5
      timeout: 5s

volumes:
  ollama-models:

networks:
  castro-network:
    driver: bridge

```

You can also create the .env file in the same directory as the compose file to ensure that the services receive the necessary environment variables. To save you the trouble of navigating to the already provided ```env.example``` file (you're welcome), here is an example of an .env file that contains the environment variables for the Castro service:

```bash

OLLAMA_API_URL=

REDIS_CONNECTION_STRING=

TEST_ENCRYPTION_KEY= # auto-generated

KEY= # auto-generated

```

## Acknowledgements

The network topology was designed by @EbodShojaei using Google Cloud Platform tutorials and documentation. AI was used to troubleshoot. All commands are tested and working.
