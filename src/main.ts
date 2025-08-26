import * as core from '@actions/core'
import * as github from '@actions/github'

import {writeDynamicConfig} from './rollbar-dynamic-config'

async function run(): Promise<void> {
  try {
    const sha = github.context.sha
    const path = core.getInput('path', {required: true})
    const projectId = core.getInput('project_id', {required: true})
    const secretPostClientItem = core.getInput('secret_post_client_item', {required: true})
    const secretPostServerItem = core.getInput('secret_post_server_item', {required: true})
    const result = await writeDynamicConfig({path, projectId, sha, secretPostClientItem, secretPostServerItem})
    if (result) {
      core.info(`Wrote dynamic config to [${path}].`)
    } else {
      core.warning(`Could not write dynamic config to [${path}]! See if secret [${secretPostClientItem}] exists in project [${projectId}]`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed('An unknown error occurred.')
    }
  }
}

run()
