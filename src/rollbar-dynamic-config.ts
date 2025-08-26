import {SecretManagerServiceClient} from '@google-cloud/secret-manager'
import {writeFile} from 'fs/promises'

interface SecretMemento {
  client: SecretManagerServiceClient
  projectId: string
}

function initSecrets(projectId: string): SecretMemento {
  const client = new SecretManagerServiceClient({projectId})
  return {client, projectId}
}

async function getSecretVersion(memento: SecretMemento, simpleSecretName: string, version = 'latest'): Promise<string | undefined> {
  const name = memento.client.secretVersionPath(memento.projectId, simpleSecretName, version)
  const [response] = await memento.client.accessSecretVersion({name})
  if (!response.payload || !response.payload.data) return undefined
  if (typeof response.payload.data === 'string') return response.payload.data
  return Buffer.from(response.payload.data).toString('utf8')
}

function createDocument({tokenPostClientItem, sha}: {tokenPostClientItem: string; sha: string}): string {
  return `
import {RollbarDynamicConfig} from '@e11community/constants'

export const rollbarDynamicConfig: RollbarDynamicConfig = {
  accessToken: '${tokenPostClientItem}',
  code_version: '${sha}',
}
`
}

export async function writeDynamicConfig({
  path,
  projectId,
  sha,
  secretPostClientItem,
}: {
  path: string
  projectId: string
  sha: string
  secretPostClientItem: string
  secretPostServerItem: string
}): Promise<boolean> {
  const memento = initSecrets(projectId)
  const tokenPostClientItem = await getSecretVersion(memento, secretPostClientItem)
  if (!tokenPostClientItem) return false
  const doc = createDocument({tokenPostClientItem, sha})
  await writeFile(path, doc, {encoding: 'utf8'})
  return true
}
