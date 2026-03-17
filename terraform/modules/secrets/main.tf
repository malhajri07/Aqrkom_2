# Secret Manager for Aqarkom
# Stores DATABASE_URL, REDIS_URL, JWT_SECRET, etc.

resource "google_secret_manager_secret" "database_url" {
  secret_id = "${var.project_name}-database-url"
  project   = var.project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "redis_url" {
  secret_id = "${var.project_name}-redis-url"
  project   = var.project_id

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "${var.project_name}-jwt-secret"
  project   = var.project_id

  replication {
    auto {}
  }
}
