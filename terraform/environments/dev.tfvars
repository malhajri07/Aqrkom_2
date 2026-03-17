project_id   = "your-gcp-project-id"
environment  = "dev"
region       = "me-central1"
project_name = "aqarkom"

# Set via TF_VAR_db_password or -var; do not commit
# db_password = "changeme"

# Enable modules when ready
enable_cloud_sql   = false
enable_memorystore = false
enable_cloud_run   = false
