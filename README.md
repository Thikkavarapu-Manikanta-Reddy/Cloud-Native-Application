# Web Application Deployment Guide

Welcome to the `webapp` project. This guide outlines the steps for setting up the project for local development, contributing via forks, and deploying the application to a Digital Ocean droplet.

## Prerequisites

Before you start, ensure you have the following tools installed on your local development environment:

- **Git**: For version control.
- **Node.js**: Preferably the LTS version, as the runtime environment for the application.
- **npm**: For managing Node.js packages.
- **MySQL**: For database management

## Setting Up for Local Development

1. **Clone the Repository**: Since the initial `webapp` repository is empty, start by forking the repository into your own GitHub namespace.

    - Navigate to the `webapp` repository in the GitHub organization.
    - Click on the "Fork" button to create a copy in your account.

2. **Clone Your Fork Locally**:

    ```bash
    git clone git@github.com:ORG_NAME/webapp_fork_name.git
    cd webapp_fork_name
    ```

3. **To Install Dependencies**:

    ```bash
    npm install
    ```

4. **To Run Locally**:

    ```bash
    npm run dev
    ```
5. **To Run Test**:

    ```bash
    npm run test
    ```

## Contributing

1. **Create a Feature Branch** in your fork:

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make Changes** and commit them to your branch.

    ```bash
    git commit -am "Add commit message"
    ```

3. **Push Changes** to your GitHub fork:

    ```bash
    git push origin feature/your-feature-name
    ```

4. **Open a Pull Request (PR)** against the main `webapp` repository from your fork on GitHub.

## Preparing for Deployment

After the development is complete:

1. **Ensure the `.gitignore` File Is Updated**: Include node_modules, .env files, and other sensitive/unnecessary files.

2. **Prepare Your Application for Deployment**: Ensure all configurations and environment variables are set correctly.

## Web Application Deployment on Digital Ocean

## Prerequisites

Before you begin, ensure you have:

- A Digital Ocean account.
- A CentOS droplet created in your Digital Ocean account.
- SSH access configured for your droplet. Digital Ocean's documentation provides guidance on [setting up SSH keys](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/).

## Deployment Steps

### Step 1: Connect to Your Droplet

1. **Open a Terminal** on your local machine.
2. **SSH into Your Droplet** using the following command to your desired user:

    ```bash
    ssh -i ~/.ssh/sshKeyPath user@DROPLET_IP
    ```

    Replace `DROPLET_IP` with your droplet's IPv4 address.

### Step 2: Transfer the Application to the Droplet

1. **From your local machine**, use the `scp` command to securely copy the application zip file to your droplet:

    ```bash
    scp -i ~/.ssh/sshKeyPath path/to/webapp-main.zip user@DROPLET_IP:/user
    ```

    Ensure you replace `path/to/webapp-main.zip` with the actual path to your zip file and `DROPLET_IP` with your droplet's IPv4 address.

### Step 3: Set Up the Environment on the Droplet

After connecting to your droplet via SSH, execute the following commands:

1. **Install Unzip** to extract your application files.

    ```bash
    dnf install unzip
    ```

2. **Unzip the Application** in the desired directory.

    ```bash
    unzip webapp-main.zip
    ```

3. **Install MySQL Server** to manage your application's database.

    ```bash
    dnf install mysql-server
    sudo systemctl enable mysqld.service
    sudo systemctl start mysqld.service
    sudo mysql_secure_installation
    ```

4. **Install NVM and Node.js** for running your Node.js application.

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    ```

## Step 4: Build and Run the Application

1. **Navigate to Your Application Directory** where you've unzipped your application files.

    ```bash
    cd webapp-main
    ```

2. **Install Application Dependencies** using npm.

    ```bash
    npm install
    ```

3. **Configure Your Application** by editing the `.env` file with necessary environment variables like database connection details.

    ```bash
    vi .env
    ```

4. **Optionally, Run Tests** to ensure your application is set up correctly.

    ```bash
    npm run test
    ```

5. **Start Your Application** in development mode.

    ```bash
    npm run dev
    ```

## Step 5: Verify the Application is Running

- Access your application through a tool like `curl` or `Postman` to make requests to your application's endpoints, such as the `healthz` endpoint, to verify it is running correctly.

## Step 6: Integration Testing

Use below command to run integration tests:
```bash
npm run test:integration
```

## Additional Notes

- **Environment Variables**: Make sure to configure your production environment variables appropriately on the droplet.
- **Database Setup**: Configure your RDBMS with the required databases and permissions.

## Assignment 4: Packer & Custom Images

### Building Custom Application Images using Packer

For this assignment, we are using Packer to create custom images with the following specifications:

- Source Image: Centos Stream 8 (latest)
- Custom images are set to be private, only launchable by authorized users.
- Custom image builds occur in our DEV GCP project.
- Builds are configured to run in the default VPC.
- The custom image includes everything needed to run our application, including dependencies like MySQL installed locally.
- The Packer template is stored in the same repository as the web application code.
- To format and test Packer locally, run packer fmt packer.
- To validate: `packer validate -var 'project_id=<project_id>' -var 'zone=<zone>' packer` (Remember to add zip file locally to test for this and below step)
- To build locally for testing: `packer build -var 'project_id=<project_id>' -var 'zone=<zone>' packer`

## GitHub Actions Workflows

### Packer Continuous Integration

#### Add New GitHub Actions Workflow for Status Check

When a pull request is raised, this GitHub Actions workflow performs the following checks on the Packer template:

- Runs the `packer fmt` command. If the command modifies the template, the workflow fails, preventing users from merging the pull request.
- Runs the `packer validate` command. If validation fails, the workflow fails, preventing users from merging the pull request.

#### Add New GitHub Actions Workflow to Build Packer custom image

When a pull request is merged, this GitHub Actions workflow executes the following steps:

- Runs integration tests.
- Builds the application artifact (zip) on the GitHub Actions runner.
- Builds the custom image with the following configurations:
  - Creates a local user `csye6225` with primary group `csye6225`. The user does not have a login shell.
  - Installs application dependencies and sets up the application by copying the artifacts and configuration files.
  - Ensures that application artifacts and configurations are owned by user `csye6225` and group `csye6225`.
  - Adds a systemd service file(runappdefault.service) to `/etc/systemd/system` and configures it to start the service when an instance is launched.
  - Reloads systemd with `systemctl daemon-reload` and enables the service with `systemctl enable runappdefault`.

No custom image is built if any of the jobs or steps in the workflow fail.

### Setup Instructions

To set up the workflows and ensure proper execution:

1. Create a new IAM service account in the DEV GCP project for GitHub Actions and configure the security credentials in your organization repository.
2. Grant the service account the necessary roles for image building and instance management.
3. Install and configure the gcloud CLI on your GitHub Actions runner using the provided marketplace action.

Follow these instructions to integrate the workflows seamlessly into your development process.