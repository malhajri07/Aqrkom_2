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

variable "memory_size_gb" {
  description = "Redis memory size in GB"
  type        = number
  default     = 2
}

variable "reserved_ip_range" {
  description = "Reserved IP range for Redis (must be in VPC, e.g. 10.2.0.0/29)"
  type        = string
}
