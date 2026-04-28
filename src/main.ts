import {getInput, info, setFailed, warning} from '@actions/core'
import {context} from '@actions/github'

import {writeDynamicConfig} from './rollbar-dynamic-config'

async function run(): Promise<void> {
  try {
    const sha = context.sha
    const path = getInput('path', {required: true})
    const projectId = getInput('project_id', {required: true})
    const secretPostClientItem = getInput('secret_post_client_item', {required: true})
    const result = await writeDynamicConfig({path, projectId, sha, secretPostClientItem})
    if (result) {
      info(`Wrote dynamic config to [${path}].`)
    } else {
      warning(`Could not write dynamic config to [${path}]! See if secret [${secretPostClientItem}] exists in project [${projectId}]`)
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message)
    } else {
      setFailed('An unknown error occurred.')
    }
  }
}

run()
