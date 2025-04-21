# Create a Google Artifact Registry repository
resource "google_artifact_registry_repository" "backend_repo" {
  project      = var.project_id
  location     = var.gcr_region
  repository_id = var.backend_image_name
  format       = "DOCKER" # Specify the format as DOCKER
}

# Deploy the backend service to Cloud Run
resource "google_cloud_run_v2_service" "backend_service" {
  name     = var.backend_service_name
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = "gcr.io/${var.project_id}/${var.backend_image_name}"
      ports {
        container_port = var.container_port
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Make the Cloud Run service publicly accessible
resource "google_cloud_run_v2_service_iam_member" "noauth" {
  name     = "${google_cloud_run_v2_service.backend_service.name}"
  project  = var.project_id
  location = google_cloud_run_v2_service.backend_service.location
#   service  = google_cloud_run_v2_service.backend_service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Output the Cloud Run service URL
output "backend_url" {
  value = google_cloud_run_v2_service.backend_service.uri
}