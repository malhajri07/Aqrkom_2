# Cloud Storage buckets for Aqarkom
# Photos, documents, static web

resource "google_storage_bucket" "web" {
  name          = "${var.project_id}-${var.project_name}-web"
  location      = var.region
  project       = var.project_id
  force_destroy = var.environment != "prod"

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
  }
}

resource "google_storage_bucket" "uploads" {
  name          = "${var.project_id}-${var.project_name}-uploads"
  location      = var.region
  project       = var.project_id
  force_destroy = var.environment != "prod"

  uniform_bucket_level_access = true
}
