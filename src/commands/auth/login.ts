import { input, password } from '@inquirer/prompts';
import { Command, Flags, ux } from '@oclif/core';
import axios, { AxiosError } from 'axios';

import { Accounts } from '../../types/auth.types.js';
import { Storage } from '../../utils/storage.util.js';
import { URL } from '../../utils/url.util.js';

export default class AuthLogin extends Command {
  static description = 'Login to Ubersetzer';
  static examples = ['<%= config.bin %> <%= command.id %>'];
  static flags = {
    help: Flags.help({ char: 'h' }),
    password: Flags.string({ char: 'p', description: 'Password' }),
    user: Flags.string({ char: 'u', description: 'Email to login' }),
  };
private storage = new Storage();

  public async run(): Promise<void> {
    const { flags } = await this.parse(AuthLogin);

    const email = flags.user ?? (await input({ message: 'Email' }));
    const pwd
      = flags.password ?? (await password({ message: 'Password', mask: '*' }));

    try {
      const response = await axios.post(URL.authLogin(), {
        email,
        password: pwd,
        scope: 'cli',
      });

      const { accessToken } = response.data;
      const userId = response.data.user.id;

      const accounts: Accounts = this.storage.get('accounts') ?? {};

      accounts[userId] = {
        accessToken,
        email,
      };

      this.storage.set('accounts', accounts);

      if (Object.keys(accounts).length === 1) {
        this.storage.set('currentAccount', userId);
      }

      this.log(`✅ Successfully logged in as ${email}.`);
    } catch (error) {
      const errorResponse = (error as AxiosError).response;

      if (errorResponse?.status === 401) {
        this.log('❌ Invalid email or password.');

        return;
      }

      this.log(`❌ Something went wrong. Please try again.${
        errorResponse?.status ? ` (${errorResponse.status})` : ''
      }`);
    }
  }
}
