output "region" {
  description = "Deployment region (me-central1)"
  value       = var.region
}

output "project_id" {
  description = "GCP project ID"
  value       = var.project_id
}

output "web_bucket" {
  description = "Web static assets bucket"
  value       = module.cloud_storage.web_bucket
}

output "uploads_bucket" {
  description = "Uploads bucket"
  value       = module.cloud_storage.uploads_bucket
}

output "api_url" {
  description = "Cloud Run API URL"
  value       = var.enable_cloud_run ? module.cloud_run[0].api_url : null
}

output "connector_name" {
  description = "VPC Access Connector name"
  value       = module.networking.connector_name
}
