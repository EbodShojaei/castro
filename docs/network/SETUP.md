# Setup | Network

This script creates a network with two subnets, one for the AI server and one for the Bastion host. It also creates a Cloud Router and Cloud NAT configuration for the network.

The network is configured with an internal IPv6 ULA range for the AI server and an external IPv4 range for the Bastion host. The AI server is only accessible via the Bastion host, which is managed by OS Login and an SSH Access Group. The AI server can access the internet through Cloud NAT. We use Google Groups to manage access to the AI server.

## Why?

- **PRIVACY**: We want the AI in its own private server without direct external access. The **Bastion host** provides a secure way to access the AI server via SSH.
- **IDENTITY**: We also want to ensure that the AI server can access the internet for updates and other services without exposing it directly. **Cloud NAT** provides this functionality.
- **ACCESS**: We need to ensure that the AI server is secure and that only authorized users can access it. We use OS Login and an SSH Access Group to manage access with **Google Groups**.

```bash

# Define Project and Network Variables
PROJECT_ID="app-main"
REGION="us-central1"
ZONE="${REGION}-a"

NETWORK_NAME="app-main-net"

# Subnet Configuration
INTERNAL_SUBNET_NAME="app-sub-net-int-${REGION}"
EXTERNAL_SUBNET_NAME="app-sub-net-ext-${REGION}"
INTERNAL_SUBNET_CIDR="10.0.1.0/24"
EXTERNAL_SUBNET_CIDR="10.0.2.0/24"
INTERNAL_IPV6_RANGE="fd20:1::/48"
### **NOTE** fd20::/20 is the ULA prefix (Over 18 quintillion unique IPv6 addresses for our internal network)

# Access Group for OS Login
SSH_ACCESS_GROUP="group:app@googlegroups.com"

# Enable required APIs
gcloud services enable iap.googleapis.com

# Create Mainnet with internal IPV6 ULA (if not already created)
gcloud beta compute networks create app-main-net \
    --project=${PROJECT_ID} \
    --subnet-mode=custom \
    --mtu=1460 \
    --enable-ula-internal-ipv6 \
    --internal-ipv6-range=${INTERNAL_IPV6_RANGE} \
    --bgp-routing-mode=regional \
    --bgp-best-path-selection-mode=legacy

# Create Internal Subnet for the AI Server
gcloud compute networks subnets create ${INTERNAL_SUBNET_NAME} \
    --network=${NETWORK_NAME} \
    --region=${REGION} \
    --range=${INTERNAL_SUBNET_CIDR} \
    --stack-type=IPV4_IPV6 \
    --ipv6-access-type=INTERNAL || true

# Create External Subnet for the Bastion Host
gcloud compute networks subnets create ${EXTERNAL_SUBNET_NAME} \
    --network=${NETWORK_NAME} \
    --region=${REGION} \
    --range=${EXTERNAL_SUBNET_CIDR} \
    --stack-type=IPV4_IPV6 \
    --ipv6-access-type=EXTERNAL || true

# Grant IAP Tunnel Access to the Google Group
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="${SSH_ACCESS_GROUP}" \
    --role="roles/iap.tunnelResourceAccessor"

# Grant OS Login Permissions to the SSH Access Group
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="${SSH_ACCESS_GROUP}" \
    --role="roles/compute.osLogin"

# Create a Cloud Router (required for Cloud NAT)
gcloud compute routers create app-router \
    --network=${NETWORK_NAME} \
    --region=${REGION}

# Create a Cloud NAT configuration for all subnet ranges in the network
gcloud compute routers nats create app-nat \
    --router=app-router \
    --region=${REGION} \
    --nat-all-subnet-ip-ranges \
    --auto-allocate-nat-external-ips
```

## Acknowledgements

The network topology was designed by @EbodShojaei using Google Cloud Platform tutorials and documentation. AI was used to troubleshoot. All commands are tested and working.
