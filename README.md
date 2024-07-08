## Repo content

app             - application sources in Javascript (NodeJS)

chart/alb       - helm charts and templates of the ALB controller

chart/app       - halm charts and templates of the application

infra/terraform - IaC sources of the deployable infrastructure

local/db        - test database deployment for local development

## Preparation

1. You need an AWS account and an IAM user with an access key and administrative access
2. AWS CLI should be installed (v2.17.9 or higher is preferable)
3. Terraform should be installed (v1.9.1 or higher is preferable)
4. NodeJS v20 should be installed
5. Helm should be installed
6. Kubectl should be installed
7. jq and yq are present

## Local development

1. Install DB from `local/db` directory by running
```
docker-compose up -d
```
That DB will be used for integration testing

2. Navigate to `app` and run
```
npm i
```
```
npm test
```

3. To run the application in a hot reload mode
`npm run dev`

**Important note:** to achieve no-downtime deployment it is better to follow the **online migrations approach**.
Shortly, every release should support the migrations from both neighbour releases and no data should be mutated, it should be added or removed if possible. 

## Infrastructure

System diagram
![System diagram](https://github.com/lonedone/rev-test/blob/main/system_diagram.png?raw=true)
## Infrastructure deployment

Setup the following environment variables with the relevant values:
```
AWS_REGION AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY
```

1. Navigate to `local/db` and run
```
terraform init
terraform apply
```
Accept if everything is ok.

## Deployment of the application to the cloud

For testing the existing image can be used: `ghcr.io/lonedone/rev-test:latest`

However, if you want to push your own image:
```
docker login --username your_gh_username --password your_gh_token ghcr.io
docker buildx . -t ghcr.io/your_username/your_repo:latest --platform=linux/amd64
docker push ghcr.io/your_username/your_repo:latest
```

1. Run
```
export DB_ADDRESS=$(jq -r '.outputs.db_address' infra/terraform/terraform\ copy.tfstate); yq eval -i '.env.DB_HOST = env(DB_ADDRESS)' chart/app/values.yaml
```
2. aws eks update-kubeconfig --region us-east-1 --name test-cluser  
3. kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
4. Navigate to `chart/alb` and run 
```
helm upgrade --install alb . 
```
5. Navigate to `chart/app` and run 
```
helm upgrade --install test-app .
```
6. Run the following command
`export LB_DNS_NAME=$(kubectl describe service test-app-service | grep "LoadBalancer Ingress" | awk '{print $3}'); export API_URL="http://${LB_DNS_NAME}/"`
7. Navigate to `app` and run
`npm run system_test`
That will run tests against the application deployed to the cluster

You may use `k9s` tool to check the cluster resources and events

## Some important considerations

To ensure no-downtime deployment: probes are specified, replicas of the deployment are set.
An online migrations approach should be used to rule out failures related to DB inconsistency.
Tools like ArgoCD should be onboarded for a neat deployment.
RollingUpdate may be fine-tuned to improve deployments under load.

Timezone of the server is considered to be a pivot for days difference calculation.

Since there is no "you BD tomorrow" sentence in the task, I consider it to be "in 1 day"

In the current implementation migrations are done as part of the application, that works here considering the amount of living replicas and that they are not updated more than one application at a time, but for real-life application migrations should be executed as a separate task.

It would make sense to use self-hosted K8S to reduce costs, but since there is no restriciton on that I use EKS here.

There are no tight security groups, firewalls, policies etc. Pod security groups, aws and k8s secrets, and other resources could be used to raise the overall security level.

ECR could be used as a registry, but I used Github Packages as it is free.

Testing may have also been done via kubernetes or docker locally, but running the application on the local OS is better for debugging.

OIDC/Roles is preferable, but I used access key here for simplicity.

It is better to use a TF backend, here it is not used.

There are other tools to build images, but docker works fine and supports buildx.

Versioning must be enabled.

Default namespace used.

DB master username should not be used for migrations and in the application, here it is used as it is a simple test application.

CI/CD is not onboarded.
