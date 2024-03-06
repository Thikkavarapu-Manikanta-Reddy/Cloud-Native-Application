variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "image_name" {
  type        = string
  description = "The name of the created machine image"
  default     = "centos-image"
}

variable "zone" {
  type        = string
  description = "The zone where the GCP resources will be created"
}

variable ssh_user {
  type        = string
  description = "Name of the ssh user"
  default     = "packer"
}

variable source_image_family {
  type        = string
  description = "Source image family being created"
  default     = "centos-stream-8"
}

variable image_family {
  type        = string
  description = "Image Family of the image being created"
  default     = "centos-8"
}

// UPDATED THE DATABASE TO NEW GCP INSTANCE

// variable "sql_user" {
//   type    = string
//   default = "user"
// }

// variable "sql_password" {
//   type    = string
//   default = "pass"
// }