output "vpc_id" {
  description = "EKS control plane endpoint"
  value       = module.vpc.vpc_id
}

output "cluster_endpoint" {
  description = "EKS control plane endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "EKS cluster control plane SG"
  value       = module.eks.cluster_security_group_id
}

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "db_address" {
  description = "RDS DB address"
  value       = module.rds_db.db_instance_address
}
