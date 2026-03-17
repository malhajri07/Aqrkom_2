output "web_bucket" {
  description = "Web static assets bucket name"
  value       = google_storage_bucket.web.name
}

output "uploads_bucket" {
  description = "Uploads (photos, docs) bucket name"
  value       = google_storage_bucket.uploads.name
}
