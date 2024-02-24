packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.1"
    }
  }
}

source "googlecompute" "custom-mi" {
  project_id          = var.project_id
  zone                = var.zone
  network             = var.network
  image_name          = var.image_name
  ssh_username        = var.ssh_username
  source_image_family = var.source_image_family
  # disk_size              = "20"
  # disk_type              = "pd-standard"
  # image_description      = "A custom image with webapp pre-installed"
  # image_family           = "csye6255-app-image"
  # image_project_id       = "csye6255-assignemnt-3"
  # image_storage_locations = ["us"]
}

build {
  name = "csye6255-assignemnt-4-centos"
  sources = [
   "source.googlecompute.custom-mi"
  ]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }

  provisioner "shell" {
    script = "./startapp.sh"
    environment_vars = [
      "SQL_USER=${var.sql_user}",
      "SQL_PASSWORD=${var.sql_password}"
    ]
  }

}

