## AWS CloudFront Cache Invalidation Github Action
> This action can be used to perform `CreateInvalidationCommand` against an AWS CloudFront distribution in order to invalidate caches content, so users of an app can get the latest content to be cached as explained here -> https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html 

## Description

Invalidate cache within a specific AWS CloudFront distribution

## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `aws_region` | <p>CloudFront is basically regionless, but it requires you to use any region to talk to it</p> | `true` | `""` |
| `cf_distribution_id` | <p>The ID of the CloudFront distribution you want to manage. This is required for operations such as invalidation or updating distribution settings</p> | `true` | `""` |
| `cf_invalidation_paths` | <p>A list of paths to invalidate in the CloudFront distribution. Paths should be specified as an array of strings, e.g., ["/index.html", "/<em>"]. Use "/</em>" to invalidate all objects</p> | `true` | `""` |

## Runs

This action is a `node20` action.

## Usage

```yaml
- uses: <project>@<version>
  with:
    aws_region:
    # CloudFront is basically regionless, but it requires you to use any region to talk to it
    #
    # Required: true
    # Default: ""

    cf_distribution_id:
    # The ID of the CloudFront distribution you want to manage. This is required for operations such as invalidation or updating distribution settings
    #
    # Required: true
    # Default: ""

    cf_invalidation_paths:
    # A list of paths to invalidate in the CloudFront distribution. Paths should be specified as an array of strings, e.g., ["/index.html", "/*"]. Use "/*" to invalidate all objects
    #
    # Required: true
    # Default: ""
```