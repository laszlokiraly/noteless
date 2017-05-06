# CLI commands to create cognito federated identity

## analysis
```
$ aws cognito-identity describe-identity-pool --identity-pool-id us-east-1:f27bf85b-aaa9-4632-bcc5-0c087aefbeef                                               
{
    "IdentityPoolId": "us-east-1:f27bf85b-aaa9-4632-bcc5-0c087aefbeef",
    "AllowUnauthenticatedIdentities": false,
    "SupportedLoginProviders": {
        "accounts.google.com": "190810895374-8ku4clenkio7kcip93b0jbs1sq9qb6me.apps.googleusercontent.com"
    },
    "IdentityPoolName": "NotelessPool"
}

$ aws cognito-identity get-identity-pool-roles --identity-pool-id us-east-1:f27bf85b-aaa9-4632-bcc5-0c087aefbeef
{
    "IdentityPoolId": "us-east-1:f27bf85b-aaa9-4632-bcc5-0c087aefbeef",
    "Roles": {
        "unauthenticated": "arn:aws:iam::334066760643:role/Cognito_NotelessPoolUnauth_Role",
        "authenticated": "arn:aws:iam::334066760643:role/Cognito_NotelessPoolAuth_Role"
    }
}

$ aws iam get-role --role-name Cognito_NotelessPoolAuth_Role
{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "sts:AssumeRoleWithWebIdentity",
                    "Effect": "Allow",
                    "Condition": {
                        "StringEquals": {
                            "cognito-identity.amazonaws.com:aud": "us-east-1:f27bf85b-aaa9-4632-bcc5-0c087aefbeef"
                        },
                        "ForAnyValue:StringLike": {
                            "cognito-identity.amazonaws.com:amr": "authenticated"
                        }
                    },
                    "Principal": {
                        "Federated": "cognito-identity.amazonaws.com"
                    }
                }
            ]
        },
        "RoleId": "AROAIPYFT7GOHM35KUBH4",
        "CreateDate": "2017-05-03T08:40:46Z",
        "RoleName": "Cognito_NotelessPoolAuth_Role",
        "Path": "/",
        "Arn": "arn:aws:iam::334066760643:role/Cognito_NotelessPoolAuth_Role"
    }
}

$ aws iam list-role-policies --role-name Cognito_NotelessPoolAuth_Role                                                                      {
    "PolicyNames": [
        "oneClick_Cognito_NotelessPoolAuth_Role_1493800813018"
    ]
}

$ aws iam get-role-policy --role-name Cognito_NotelessPoolAuth_Role --policy-name oneClick_Cognito_NotelessPoolAuth_Role_1493800813018
{
    "RoleName": "Cognito_NotelessPoolAuth_Role",
    "PolicyDocument": {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [
                    "mobileanalytics:PutEvents",
                    "cognito-sync:*",
                    "cognito-identity:*"
                ],
                "Resource": [
                    "*"
                ],
                "Effect": "Allow"
            },
            {
                "Action": [
                    "execute-api:Invoke"
                ],
                "Resource": "arn:aws:execute-api:*:*:*",
                "Effect": "Allow"
            }
        ]
    },
    "PolicyName": "oneClick_Cognito_NotelessPoolAuth_Role_1493800813018"
}
```

http://docs.aws.amazon.com/cli/latest/reference/cognito-identity/create-identity-pool.html
http://docs.aws.amazon.com/cli/latest/reference/cognito-identity/set-identity-pool-roles.html

config.json needs configuration of AWS.GOOGLE.ROLE_ARN(lookup) and AWS.COGNITO.IDENTITY_POOL_ID
```
