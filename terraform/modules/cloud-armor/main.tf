# Cloud Armor WAF — SQLi, XSS, rate limiting
# Attach to HTTP(S) Load Balancer backend when using custom domain

resource "google_compute_security_policy" "waf" {
  name        = "${var.project_name}-waf"
  description = "Aqarkom WAF: SQLi, XSS, rate limit"
  project     = var.project_id

  # Rate limiting (100 req/min per IP)
  rule {
    action   = "rate_based_ban"
    priority = "1000"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    rate_limit_options {
      conform_action  = "allow"
      exceed_action  = "deny(429)"
      enforce_on_key = "IP"
      ban_duration_sec = 60
      rate_limit_threshold {
        count        = var.rate_limit_threshold
        interval_sec = 60
      }
    }
  }

  # SQL injection
  rule {
    action   = "deny(403)"
    priority = "2000"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('sqli-v33-stable')"
      }
    }
    description = "Block SQL injection"
  }

  # XSS
  rule {
    action   = "deny(403)"
    priority = "2001"
    match {
      expr {
        expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
      }
    }
    description = "Block XSS"
  }

  # Default allow
  rule {
    action   = "allow"
    priority = "2147483647"
    match {
      versioned_expr = "SRC_IPS_V1"
      config {
        src_ip_ranges = ["*"]
      }
    }
    description = "Default allow"
  }
}
