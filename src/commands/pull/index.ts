import { Args, Command, Flags, ux, handle } from '@oclif/core';
import { select } from '@inquirer/prompts';
import { getConfig } from '../../utils/get-config.util.js';
import { unpackExport } from '../../utils/unpack-export.util.js';
import { downloadExport } from '../../utils/download-export.util.js';

export default class Pull extends Command {
  static description = 'Pull translations for a project';

  static examples = [`$ ubersetzer pull`];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = {
    name: Args.string(),
  };

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
          message: 'Which project do you want to pull?',
          choices,
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

      this.log(
        `The API responded with ${error}. Please check your project's config.`,
      );
    }

    await unpackExport(projectConfig);

    ux.action.stop('Done! ✅');
  }

  async catch() {}
}
