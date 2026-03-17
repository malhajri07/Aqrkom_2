output "host" {
  description = "Redis host"
  value       = google_redis_instance.main.host
}

output "port" {
  description = "Redis port"
  value       = google_redis_instance.main.port
}

output "redis_url" {
  description = "Redis URL (redis://host:port)"
  value       = "redis://${google_redis_instance.main.host}:${google_redis_instance.main.port}"
}
