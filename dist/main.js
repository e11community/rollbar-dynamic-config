"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const rollbar_dynamic_config_1 = require("./rollbar-dynamic-config");
async function run() {
    try {
        const sha = github.context.sha;
        const path = core.getInput('path', { required: true });
        const projectId = core.getInput('project_id', { required: true });
        const secretPostClientItem = core.getInput('secret_post_client_item', { required: true });
        const secretPostServerItem = core.getInput('secret_post_server_item', { required: true });
        const result = await (0, rollbar_dynamic_config_1.writeDynamicConfig)({ path, projectId, sha, secretPostClientItem, secretPostServerItem });
        if (result) {
            core.info(`Wrote dynamic config to [${path}].`);
        }
        else {
            core.warning(`Could not write dynamic config to [${path}]! See if secret [${secretPostClientItem}] exists in project [${projectId}]`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed('An unknown error occurred.');
        }
    }
}
run();
