terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0" # Or the latest version
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region # Your preferred Google Cloud region
}