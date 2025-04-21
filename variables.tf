variable "project_id" {
  type        = string
  description = "value of the project id"
  default = "interactive-web-image-editor"
}

variable "region" {
  type        = string
  description = "The Google Cloud region to deploy Cloud Run"
  default     = "europe-west2" # You can set a default value
}

variable "gcr_region" {
  type        = string
  description = "The Google Container Registry region (e.g., 'us', 'europe', 'asia')"
  default     = "europe"
}

variable "backend_image_name" {
  type        = string
  description = "The name of your backend Docker image in GCR"
  default     = "image-editor-registry-backend"
}

variable "backend_service_name" {
  type        = string
  description = "The name of your Cloud Run backend service"
  default     = "image-editor-backend"
}

variable "container_port" {
  type        = number
  description = "The port your backend container listens on"
  default     = 8080
}