variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "network_id" {
  description = "VPC network ID for private IP"
  type        = string
}

variable "db_tier" {
  description = "Cloud SQL tier"
  type        = string
  default     = "db-custom-2-8192"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "aqarkom"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "aqarkom"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
