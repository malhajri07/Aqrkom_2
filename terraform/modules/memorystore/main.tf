# Memorystore Redis for Aqarkom
# me-central1 (Saudi data residency)

resource "google_redis_instance" "main" {
  name           = "${var.project_name}-redis"
  tier           = "STANDARD_HA"
  memory_size_gb = var.memory_size_gb
  region         = var.region
  project        = var.project_id

  redis_version     = "REDIS_7_0"
  display_name      = "Aqarkom Redis"
  reserved_ip_range = var.reserved_ip_range

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
      }
    }
  }
}
