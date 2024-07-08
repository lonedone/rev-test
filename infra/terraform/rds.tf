module "rds_db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "v6.7.0"

  identifier     = "test-db"
  engine         = "postgres"
  engine_version = "16.3"
  instance_class = "db.t4g.micro"

  db_name                     = var.db_name
  username                    = var.db_username
  password                    = var.db_password
  manage_master_user_password = false
  port                        = 5432

  family = "postgres16"

  db_subnet_group_name = module.vpc.database_subnet_group_name

  create_monitoring_role = true
  monitoring_role_name   = "TestRdsDbMonitoringRole"
  monitoring_interval    = 60

  allocated_storage      = 20
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false
}

resource "aws_security_group" "rds" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = concat(module.vpc.private_subnets_cidr_blocks, module.vpc.public_subnets_cidr_blocks)
    security_groups = [module.eks.node_security_group_id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = module.vpc.private_subnets_cidr_blocks
  }
}
