# Aqarkom Infrastructure - GCP me-central1 (Dammam)
# Saudi data residency: ALL resources in me-central1

terraform {
  required_version = ">= 1.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Uncomment and configure for remote state
  # backend "gcs" {
  #   bucket = "aqarkom-tfstate"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "run" {
  project = var.project_id
  service = "run.googleapis.com"
}

resource "google_project_service" "artifact_registry" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"
}

resource "google_project_service" "sqladmin" {
  project = var.project_id
  service = "sqladmin.googleapis.com"
}

resource "google_project_service" "redis" {
  project = var.project_id
  service = "redis.googleapis.com"
}

resource "google_project_service" "secretmanager" {
  project = var.project_id
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "servicenetworking" {
  project = var.project_id
  service = "servicenetworking.googleapis.com"
}

resource "google_project_service" "vpcaccess" {
  project = var.project_id
  service = "vpcaccess.googleapis.com"
}

resource "google_project_service" "storage" {
  project = var.project_id
  service = "storage.googleapis.com"
}

# Cloud Armor WAF (SQLi, XSS, rate limit) — attach to LB when using custom domain
module "cloud_armor" {
  source = "./modules/cloud-armor"

  project_id   = var.project_id
  project_name = var.project_name
}

# Networking (VPC, subnet, connector, private service)
module "networking" {
  source = "./modules/networking"

  project_id   = var.project_id
  project_name = var.project_name
  region       = var.region

  depends_on = [
    google_project_service.vpcaccess,
    google_project_service.servicenetworking,
  ]
}

# Secrets (placeholders; populate values via gcloud or Console)
module "secrets" {
  source = "./modules/secrets"

  project_id   = var.project_id
  project_name = var.project_name

  depends_on = [google_project_service.secretmanager]
}

# Cloud SQL (optional)
module "cloud_sql" {
  count  = var.enable_cloud_sql ? 1 : 0
  source = "./modules/cloud-sql"

  project_id   = var.project_id
  project_name = var.project_name
  region       = var.region
  environment  = var.environment
  network_id   = module.networking.vpc_self_link
  db_password  = var.db_password

  depends_on = [
    google_project_service.sqladmin,
    module.networking,
  ]
}

# Memorystore Redis (optional)
module "memorystore" {
  count  = var.enable_memorystore ? 1 : 0
  source = "./modules/memorystore"

  project_id        = var.project_id
  project_name     = var.project_name
  region           = var.region
  reserved_ip_range = module.networking.redis_reserved_cidr

  depends_on = [
    google_project_service.redis,
    module.networking,
  ]
}

# Cloud Storage
module "cloud_storage" {
  source = "./modules/cloud-storage"

  project_id   = var.project_id
  project_name = var.project_name
  region       = var.region
  environment  = var.environment

  depends_on = [google_project_service.storage]
}

# Cloud Run (optional; requires secrets populated)
module "cloud_run" {
  count  = var.enable_cloud_run ? 1 : 0
  source = "./modules/cloud-run"

  project_id   = var.project_id
  project_name = var.project_name
  region       = var.region
  environment  = var.environment

  api_image_tag         = var.api_image_tag
  vpc_connector_id      = module.networking.connector_id
  database_url_secret   = module.secrets.database_url_secret
  redis_url_secret      = module.secrets.redis_url_secret
  jwt_secret_id         = module.secrets.jwt_secret_id

  depends_on = [
    google_project_service.run,
    module.networking,
    module.secrets,
  ]
}
