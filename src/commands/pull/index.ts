import { select } from '@inquirer/prompts';
import {
  Args, Command, Flags, handle, ux,
} from '@oclif/core';

import { downloadExport } from '../../utils/download-export.util.js';
import { getConfig } from '../../utils/get-config.util.js';
import { unpackExport } from '../../utils/unpack-export.util.js';

export default class Pull extends Command {
  static args = {
    name: Args.string(),
  };
static description = 'Pull translations for a project';
  static examples = ['$ ubersetzer pull'];
  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  async catch() {}

  public async run() {
    const { args } = await this.parse(Pull);

    const config = await getConfig();
    const projectKeys = Object.keys(config.projects);

    let selectedProject = args.name;

    if (selectedProject && !projectKeys.includes(selectedProject)) {
      throw new Error(`Unknown project ${selectedProject}`);
    }

    if (!selectedProject) {
      selectedProject = projectKeys[0];

      if (projectKeys.length > 1) {
        const choices = [];

        for (const projectKey of projectKeys) {
          choices.push({
            name: config.projects[projectKey].name || projectKey,
            value: projectKey,
          });
        }

        const answer = await select({
          choices,
          message: 'Which project do you want to pull?',
        });

        selectedProject = answer;
      }
    }

    const projectConfig = config.projects[selectedProject];

    ux.action.start('Pulling translations...');

    try {
      await downloadExport(projectConfig);
    } catch (error) {
      ux.action.stop('Failed... ❌');

      this.log(`The API responded with ${error}. Please check your project's config.`);
    }

    await unpackExport(projectConfig);

    ux.action.stop('Done! ✅');
  }
}
