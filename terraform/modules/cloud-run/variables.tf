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

variable "artifact_registry_repo" {
  description = "Artifact Registry repository name"
  type        = string
  default     = "aqarkom"
}

variable "api_image_tag" {
  description = "API Docker image tag"
  type        = string
}

variable "vpc_connector_id" {
  description = "VPC Access Connector ID"
  type        = string
}

variable "database_url_secret" {
  description = "Secret Manager secret for DATABASE_URL"
  type        = string
}

variable "redis_url_secret" {
  description = "Secret Manager secret for REDIS_URL"
  type        = string
}

variable "jwt_secret_id" {
  description = "Secret Manager secret for JWT_SECRET"
  type        = string
}

variable "allow_unauthenticated" {
  description = "Allow unauthenticated access to API"
  type        = bool
  default     = true
}
