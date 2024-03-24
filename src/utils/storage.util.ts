import Conf from 'conf';

const PROJECT_NAME = 'ubersetzer-cli';

export class Storage {
  private configStore: Conf;

  constructor() {
    this.configStore = new Conf({
      projectName: PROJECT_NAME,
      projectSuffix: '',
    });
  }

  public set(key: string, value: any): void {
    this.configStore.set(key, value);
  }

  public get(key: string): any {
    return this.configStore.get(key);
  }
}
