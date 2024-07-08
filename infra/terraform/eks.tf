locals {
  cluster_name = "test-cluser"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.17.2"

  cluster_name    = local.cluster_name
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  enable_cluster_creator_admin_permissions = true

  eks_managed_node_group_defaults = {
    ami_type = "AL2023_x86_64_STANDARD"
  }

  eks_managed_node_groups = {
    main = {
      name = "main-node-group"

      instance_types = ["t3.small"]

      min_size     = 1
      max_size     = 4
      desired_size = 3
    }
  }
}
