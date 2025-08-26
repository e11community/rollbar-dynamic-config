# image-exists

Check existence of a container image by full tag `domain/repo/name:tag`

You **MUST** login to the repo you want to check the image for

## Usage

```yaml
steps:
  - id: auth
    name: GCP Auth
    uses: google-github-actions/auth@v2
    with:
      credentials_json: ${{ secrets.GCP_SA_KEY }}
      project_id: ${{ inputs.project_id }}
  - id: student_rollbar_dynamic_config
    uses: e11community/rollbar-dynamic-config
    with:
      path: apps/student-web/src/config/rollbar-dynamic.config.ts
      secret_post_client_item: rollbar_consumer_web_post_client_item
      secret_post_server_item: rollbar_consumer_web_post_server_item
  - id: professor_rollbar_dynamic_config
    uses: e11community/rollbar-dynamic-config
    with:
      path: apps/professor-web/src/config/rollbar-dynamic.config.ts
      secret_post_client_item: rollbar_business_web_post_client_item
      secret_post_server_item: rollbar_business_web_post_server_item
```
