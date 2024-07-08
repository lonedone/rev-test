data "aws_availability_zones" "available_zones" {}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.9.0"

  name = "vpc"

  cidr = "10.4.0.0/16"
  azs  = slice(data.aws_availability_zones.available_zones.names, 0, 3)

  private_subnets  = ["10.4.1.0/24", "10.4.2.0/24", "10.4.3.0/24"]
  public_subnets   = ["10.4.4.0/24", "10.4.5.0/24", "10.4.6.0/24"]
  database_subnets = ["10.4.7.0/24", "10.4.8.0/24", "10.4.9.0/24"]

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true

  public_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                      = 1
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${local.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"             = 1
  }
}
