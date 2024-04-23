import { Command, Flags, ux } from '@oclif/core';
import { Storage } from '../../utils/storage.util.js';
import { URL } from '../../utils/url.util.js';
import axios, { AxiosError } from 'axios';
import { Accounts } from '../../types/auth.types.js';

export default class AuthLogin extends Command {
  private storage = new Storage();

  static description = 'Login to Ubersetzer';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    user: Flags.string({ char: 'u', description: 'Email to login' }),
    password: Flags.string({ char: 'p', description: 'Password' }),
    help: Flags.help({ char: 'h' }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(AuthLogin);

    const email = flags.user ?? (await ux.prompt('Email'));
    const password =
      flags.password ?? (await ux.prompt('Password', { type: 'hide' }));

    try {
      const response = await axios.post(URL.authLogin(), {
        email,
        password,
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

      this.log(
        `❌ Something went wrong. Please try again.${
          errorResponse?.status ? ` (${errorResponse.status})` : ''
        }`,
      );
    }
  }
}
