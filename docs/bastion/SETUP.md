# Setup | Bastion Server

This script creates a Bastion (Tunnel) Server for administrative access to the AI server. It also creates firewall rules to allow SSH access to the bastion from IAP and to allow the bastion to connect to the AI server.

## **A. Creating a Bastion (Tunnel) Server for Administrative Access**

> **Note:** In this example the bastion instance is used only for SSH access via IAP. The AI server remains private and sends outbound traffic through Cloud NAT.

```bash

# Define Project and Network Variables
PROJECT_ID="app-main"
REGION="us-central1"
ZONE="${REGION}-a"

NETWORK_NAME="app-main-net"
EXTERNAL_SUBNET_NAME="app-sub-net-ext-${REGION}"

BASTION_INSTANCE_NAME="bastion-server"

# Create a Bastion (Tunnel) Server for Administrative Access (Optional)
gcloud compute instances create ${BASTION_INSTANCE_NAME} \
    --project=${PROJECT_ID} \
    --zone=${ZONE} \
    --subnet=${EXTERNAL_SUBNET_NAME} \
    --no-address \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --tags=bastion-server \
    --metadata=enable-oslogin=TRUE

# Configure Firewall Rules

# Allow SSH to Bastion Server from IAP (so admins can connect)
gcloud compute firewall-rules create allow-ssh-to-bastion-from-iap \
    --project=${PROJECT_ID} \
    --network=${NETWORK_NAME} \
    --direction=INGRESS \
    --priority=1000 \
    --target-tags=bastion-server \
    --allow=tcp:22 \
    --source-ranges=35.235.240.0/20

```

## **B. Removing Unneeded Components (e.g., Tunnel/Bastion and Extra Firewall Rules)**

If you decide that you no longer need the bastion (or tunnel) host (for example, if you plan to use IAP directly on the AI server or have another method in place), you can remove its instance and the related firewall rules.

### **Remove the Bastion Instance:**

```bash
gcloud compute instances delete ${BASTION_INSTANCE_NAME} --zone=${ZONE} --quiet
```

### **Remove Associated Firewall Rules:**

```bash
gcloud compute firewall-rules delete allow-ssh-to-bastion-from-iap --quiet
gcloud compute firewall-rules delete allow-bastion-to-ai --quiet
```

## Acknowledgements

The network topology was designed by @EbodShojaei using Google Cloud Platform tutorials and documentation. AI was used to troubleshoot. All commands are tested and working.
