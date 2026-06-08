variable "vpc-name" {
    type = string
}

variable "vpc-cidr"{
    type = string
}

tags = {
    Name = var.vpc_name
}