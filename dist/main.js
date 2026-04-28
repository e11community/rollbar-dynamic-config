"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const rollbar_dynamic_config_1 = require("./rollbar-dynamic-config");
async function run() {
    try {
        const sha = github_1.context.sha;
        const path = (0, core_1.getInput)('path', { required: true });
        const projectId = (0, core_1.getInput)('project_id', { required: true });
        const secretPostClientItem = (0, core_1.getInput)('secret_post_client_item', { required: true });
        const result = await (0, rollbar_dynamic_config_1.writeDynamicConfig)({ path, projectId, sha, secretPostClientItem });
        if (result) {
            (0, core_1.info)(`Wrote dynamic config to [${path}].`);
        }
        else {
            (0, core_1.warning)(`Could not write dynamic config to [${path}]! See if secret [${secretPostClientItem}] exists in project [${projectId}]`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            (0, core_1.setFailed)(error.message);
        }
        else {
            (0, core_1.setFailed)('An unknown error occurred.');
        }
    }
}
run();
