#!/bin/bash

# Create a local user
set -e

sudo useradd -s /usr/sbin/nologin csye6225

# Update package repositories
sudo dnf update -y

# Add the NodeSource repository for Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

# Install Node.js and npm
sudo dnf install -y nodejs mysql-server unzip

# Verify installation
node --version

# Copy application artifacts

sudo mkdir -p /home/csye6225/webapp/webapp_develop/
sudo unzip /tmp/webapp -d /home/csye6225/webapp/webapp_develop/
sudo npm install --prefix /home/csye6225/webapp/webapp_develop/

# Set ownership of application files to the newly created user
sudo chown -R csye6225:csye6225 /home/csye6225/webapp/

# Show ownership of the artifacts
sudo ls -al /home/csye6225/webapp/webapp_develop/

########################################################################
#              UPDATED THE DATABASE TO NEW GCP INSTANCE                #
########################################################################

# Start MySQL service
# sudo systemctl start mysqld

# Wait for MySQL service to become available
# until sudo mysqladmin ping &>/dev/null; do
#     echo "Waiting for MySQL to start..."
#     sleep 1
# done

# Set MySQL root password
# sudo mysql -e "ALTER USER '$SQL_USER'@'localhost' IDENTIFIED WITH mysql_native_password BY '$SQL_PASSWORD'; FLUSH PRIVILEGES;"

# sudo systemctl enable mysqld

# Create systemd service file
sudo cp /home/csye6225/webapp/webapp_develop/runappdefault.service /etc/systemd/system/runappdefault.service

# Enable and start the systemd service
sudo systemctl start runappdefault
sudo systemctl enable runappdefault

# Reload systemd to load new service file

sudo systemctl daemon-reload