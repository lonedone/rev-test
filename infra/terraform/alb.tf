resource "aws_iam_role" "alb_ingress_controller" {
  name = "alb-ingress-controller"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "alb_ingress_controller_attach" {
  role       = aws_iam_role.alb_ingress_controller.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_policy" "alb_ingress_policy" {
  name        = "alb-ingress-policy"
  path        = "/"
  description = "Policy for the ALB Ingress Controller"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "ec2:Describe*",
          "elasticloadbalancing:Describe*",
          "elasticloadbalancing:CreateLoadBalancer",
          "elasticloadbalancing:CreateTargetGroup",
          "elasticloadbalancing:DeleteTargetGroup",
          "elasticloadbalancing:ModifyTargetGroup",
          "elasticloadbalancing:DescribeTargetGroups",
          "elasticloadbalancing:DescribeTargetHealth",
          "elasticloadbalancing:RegisterTargets",
          "elasticloadbalancing:DeregisterTargets",
          "elasticloadbalancing:CreateListener",
          "elasticloadbalancing:DeleteListener",
          "elasticloadbalancing:DescribeListeners",
          "elasticloadbalancing:DescribeLoadBalancers",
          "elasticloadbalancing:ModifyLoadBalancerAttributes",
          "elasticloadbalancing:ModifyListener",
          "elasticloadbalancing:CreateRule",
          "elasticloadbalancing:DeleteRule",
          "elasticloadbalancing:DescribeRules",
          "elasticloadbalancing:ModifyRule"
        ],
        "Resource" : "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "alb_ingress_controller_policy_attach" {
  role       = aws_iam_role.alb_ingress_controller.name
  policy_arn = aws_iam_policy.alb_ingress_policy.arn
}
