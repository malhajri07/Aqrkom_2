variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
}

variable "region" {
  description = "GCP region (me-central1 for Saudi)"
  type        = string
}

variable "subnet_cidr" {
  description = "CIDR for the subnet"
  type        = string
  default     = "10.0.0.0/24"
}

variable "connector_cidr" {
  description = "CIDR for VPC Access Connector"
  type        = string
  default     = "10.8.0.0/28"
}

variable "redis_reserved_cidr" {
  description = "Secondary CIDR for Memorystore Redis"
  type        = string
  default     = "10.2.0.0/29"
}
