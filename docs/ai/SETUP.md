# Setup | AI Server

This script creates an AI server with no external IP address. It also creates firewall rules to allow SSH access from the bastion host to the AI server and to deny all other inbound traffic to the AI server. Outbound traffic is allowed on ports 22, 80, and 443. Access to the AI server is managed with Google Groups for OS Login permissions.

## **A. Creating an AI Server (Private, No External IP):**

```bash

# 1. Define Project and Network Variables
PROJECT_ID="app-main"
REGION="us-central1"
ZONE="${REGION}-a"

NETWORK_NAME="app-main-net"
INTERNAL_SUBNET_NAME="app-sub-net-int-${REGION}"

AI_INSTANCE_NAME="ai-server"

# 7. Create the AI Server (Private, No External IP)
gcloud compute instances create ${AI_INSTANCE_NAME} \
    --project=${PROJECT_ID} \
    --zone=${ZONE} \
    --subnet=${INTERNAL_SUBNET_NAME} \
    --no-address \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --tags=ai-server \
    --metadata=enable-oslogin=TRUE

# 8. Configure Firewall Rules

# If using the Bastion to jump to the AI server, allow SSH from Bastion to AI server:
gcloud compute firewall-rules create allow-bastion-to-ai \
    --project=${PROJECT_ID} \
    --network=${NETWORK_NAME} \
    --direction=INGRESS \
    --priority=1000 \
    --target-tags=ai-server \
    --source-tags=bastion-server \
    --allow=tcp:22

# Deny all other inbound traffic to the AI server (or tighten as needed)
gcloud compute firewall-rules create deny-all-other-ingress-to-ai \
    --project=${PROJECT_ID} \
    --network=${NETWORK_NAME} \
    --direction=INGRESS \
    --priority=2000 \
    --target-tags=ai-server \
    --action=DENY \
    --rules=all

# Allow outbound traffic (most egress traffic is allowed by default, but you can enforce specific ports)
gcloud compute firewall-rules create allow-ai-egress \
    --project=${PROJECT_ID} \
    --network=${NETWORK_NAME} \
    --direction=EGRESS \
    --priority=1000 \
    --target-tags=ai-server \
    --allow=tcp:22,tcp:80,tcp:443

```

## **B. Adjust or Remove SSH-Related Configuration on the AI Server:**

We have added the bastion host, but will need to setup the tunnel approach with centralized key management. To do this, we will create a shared user on the bastion host and AI server (e.g., `admin`), and we will use the bastion host to jump to the AI server. On first setup, we will need to copy the SSH keys from the bastion to the AI server. However, to access the AI server directly, we will need to use IAP or another method.

For example:

- We have the tunnel server and private AI server.
- We have a shared user on both servers (e.g., `admin`).
- Only the admin user on the bastion host can access the AI server.

So who should hold the private key? If the AI has the private key, multiple access points to the AI server are possible, but we only want one via the tunnel server. So give the private key to the admin user on the tunnel user to assign public keys to all the servers in our mainnet (e.g., AI server, microservices, etc.).

**NOTE:** While it is possible to set a temporary firewall that allows ingress traffic from the bastion to the AI server, it is not recommended. Instead, use IAP or another secure method to access the AI server directly.

## **B.1. Accessing the AI Server Directly (Temporary):**

Since we have not enabled IAP for direct access to the AI server, we can visit the GCP Console, temporarily enable the serial console for the ai-server, then login to the root user. If the root user password is not known, we can reset it using a startup script (see below) in the serial console. This will give us access to the private AI server without needing to use the bastion host or IAP. See the [Google Cloud documentation](https://cloud.google.com/compute/docs/troubleshooting/troubleshooting-using-serial-console) for more information.

```bash

#!/bin/bash

# Define our variables
USERNAME="YOUR_USERNAME"
PASSWORD="YOUR_PASSWORD"
PUBLIC_KEY="YOUR_PUBLIC_KEY"

# Create a new user and set the password
useradd "${USERNAME}"
echo "${USERNAME}:${PASSWORD}" | chpasswd
usermod -aG google-sudoers "${USERNAME}"

# Add the public key to ssh from tunnel to AI server
sudo mkdir -p /home/${USERNAME}/.ssh
echo "${PUBLIC_KEY}" | sudo tee /home/${USERNAME}/.ssh/authorized_keys > /dev/null
sudo chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.ssh
sudo chmod 700 /home/${USERNAME}/.ssh
sudo chmod 600 /home/${USERNAME}/.ssh/authorized_keys

```

Once you have access to the AI server, you can copy the SSH keypair of the tunnel user from the bastion host to the AI server. This will allow you to SSH from the bastion host to the AI server with or without a password.

## **C. Removing Unneeded Components (e.g., Bastion and Extra Firewall Rules):**

If you remove the bastion host, you might set up direct IAP access (if supported), and you can modify or remove firewall rules that specifically reference the bastion.

For example, ensure you have a rule allowing SSH via IAP directly to your AI server if needed:

```bash
gcloud compute firewall-rules create allow-ssh-to-ai-from-iap \
    --project=${PROJECT_ID} \
    --network=${NETWORK_NAME} \
    --direction=INGRESS \
    --priority=1000 \
    --target-tags=ai-server \
    --allow=tcp:22 \
    --source-ranges=35.235.240.0/20

```

## Acknowledgements

The network topology was designed by @EbodShojaei using Google Cloud Platform tutorials and documentation. AI was used to troubleshoot. All commands are tested and working.
