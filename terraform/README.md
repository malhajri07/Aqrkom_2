# Aqarkom Terraform

Infrastructure as Code for GCP. **All resources MUST be in me-central1 (Dammam)** for Saudi data residency.

## Setup

```bash
cd terraform
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars
```

## Structure

- `main.tf` - Provider, project services
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `environments/` - Environment-specific tfvars
- `modules/` - Reusable modules (cloud-run, cloud-sql, etc.) - to be added

## Required

1. Create `environments/dev.tfvars` with your `project_id`
2. Enable billing on the GCP project
3. For remote state: create GCS bucket, uncomment backend in main.tf
