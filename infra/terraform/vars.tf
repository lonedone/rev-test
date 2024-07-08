variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "db_name" {
  type        = string
  description = "Main DB name."
  default     = "users_db"
}

variable "db_username" {
  type        = string
  description = "Main DB user username."
  default     = "postgres"
}

variable "db_password" {
  type        = string
  description = "Main DB user password."
  default     = "ExamplePassword"
}
