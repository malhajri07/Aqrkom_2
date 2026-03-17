output "vpc_id" {
  description = "VPC network ID"
  value       = google_compute_network.vpc.id
}

output "vpc_self_link" {
  description = "VPC network self link (for Cloud SQL private_network)"
  value       = google_compute_network.vpc.self_link
}

output "vpc_name" {
  description = "VPC network name"
  value       = google_compute_network.vpc.name
}

output "subnet_id" {
  description = "Subnet ID"
  value       = google_compute_subnetwork.subnet.id
}

output "connector_id" {
  description = "VPC Access Connector ID for Cloud Run"
  value       = google_vpc_access_connector.connector.id
}

output "connector_name" {
  description = "VPC Access Connector name"
  value       = google_vpc_access_connector.connector.name
}

output "redis_reserved_cidr" {
  description = "Reserved CIDR for Memorystore Redis"
  value       = var.redis_reserved_cidr
}
