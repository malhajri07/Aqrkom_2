variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "project_name" {
  type        = string
  description = "Project name prefix for resources"
}

variable "rate_limit_threshold" {
  type        = number
  default     = 100
  description = "Max requests per minute per IP before rate limiting"
}
