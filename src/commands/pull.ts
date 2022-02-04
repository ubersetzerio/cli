import { Command, flags } from "@oclif/command";
import * as inquirer from "inquirer";
import { downloadExport } from "../utils/download-export.util";
import { getConfig } from "../utils/get-config.util";
import { unpackExport } from "../utils/unpack-export.util";
import cli from "cli-ux";

export default class Pull extends Command {
  static description = "Pull translations for a project";

  static examples = [`$ ubersetzer pull`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "name" }];

  public async run() {
    const { args } = this.parse(Pull);

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

        const { answer } = await inquirer.prompt([
          {
            name: "answer",
            type: "list",
            message: "Which project do you want to pull?",
            choices,
          },
        ]);

        selectedProject = answer;
      }
    }

    const projectConfig = config.projects[selectedProject];

    cli.action.start("Pulling translations...");

    try {
      await downloadExport(projectConfig);
    } catch (error) {
      cli.action.stop("Failed... ❌");

      throw new Error(
        `API responded with ${error}. Please check your project's config.`
      );
    }

    await unpackExport(projectConfig);

    cli.action.stop("Done! ✅");
  }
}
