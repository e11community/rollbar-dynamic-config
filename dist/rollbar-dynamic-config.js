"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDynamicConfig = writeDynamicConfig;
const secret_manager_1 = require("@google-cloud/secret-manager");
const promises_1 = require("fs/promises");
function initSecrets(projectId) {
    const client = new secret_manager_1.SecretManagerServiceClient({ projectId });
    return { client, projectId };
}
async function getSecretVersion(memento, simpleSecretName, version = 'latest') {
    const name = memento.client.secretVersionPath(memento.projectId, simpleSecretName, version);
    const [response] = await memento.client.accessSecretVersion({ name });
    if (!response.payload || !response.payload.data)
        return undefined;
    if (typeof response.payload.data === 'string')
        return response.payload.data;
    return Buffer.from(response.payload.data).toString('utf8');
}
function createDocument({ tokenPostClientItem, sha }) {
    return `
import {RollbarDynamicConfig} from '@e11community/constants'

export const rollbarDynamicConfig: RollbarDynamicConfig = {
  accessToken: '${tokenPostClientItem}',
  code_version: '${sha}',
}
`;
}
async function writeDynamicConfig({ path, projectId, sha, secretPostClientItem, }) {
    const memento = initSecrets(projectId);
    const tokenPostClientItem = await getSecretVersion(memento, secretPostClientItem);
    if (!tokenPostClientItem)
        return false;
    const doc = createDocument({ tokenPostClientItem, sha });
    await (0, promises_1.writeFile)(path, doc, { encoding: 'utf8' });
    return true;
}
