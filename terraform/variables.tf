variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region - MUST be me-central1 for Saudi data residency"
  type        = string
  default     = "me-central1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "aqarkom"
}

variable "db_password" {
  description = "Cloud SQL database password (required when enable_cloud_sql=true)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "api_image_tag" {
  description = "API Docker image tag for Cloud Run"
  type        = string
  default     = "latest"
}

variable "enable_cloud_sql" {
  description = "Enable Cloud SQL module"
  type        = bool
  default     = false
}

variable "enable_memorystore" {
  description = "Enable Memorystore Redis module"
  type        = bool
  default     = false
}

variable "enable_cloud_run" {
  description = "Enable Cloud Run module"
  type        = bool
  default     = false
}
