# Aqarkom Terraform

Infrastructure as Code for GCP. **All resources MUST be in me-central1 (Dammam)** for Saudi data residency.

## Setup

```bash
cd terraform
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars
```

## Modules

| Module | Description |
|--------|-------------|
| `networking` | VPC, subnet, VPC Access Connector, private service for Cloud SQL |
| `cloud-sql` | PostgreSQL 16 (optional: `enable_cloud_sql=true`) |
| `memorystore` | Redis 7 (optional: `enable_memorystore=true`) |
| `secrets` | Secret Manager (DATABASE_URL, REDIS_URL, JWT_SECRET) |
| `cloud-storage` | Buckets for web static + uploads |
| `cloud-run` | API + Worker services (optional: `enable_cloud_run=true`) |

## Variables

- `project_id` — GCP project ID
- `db_password` — Cloud SQL password (when `enable_cloud_sql=true`)
- `enable_cloud_sql`, `enable_memorystore`, `enable_cloud_run` — Toggle modules

## Required

1. Create `environments/dev.tfvars` with your `project_id`
2. Enable billing on the GCP project
3. For remote state: create GCS bucket, uncomment backend in main.tf
4. Cloud Build: set `_API_URL`, `_WEB_BUCKET`, `_DATABASE_URL` in trigger
