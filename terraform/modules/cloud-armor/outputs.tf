output "security_policy_id" {
  value       = google_compute_security_policy.waf.id
  description = "Cloud Armor security policy ID for attaching to backend"
}

output "security_policy_name" {
  value       = google_compute_security_policy.waf.name
  description = "Cloud Armor security policy name"
}
