import { Storage } from "./storage.util.js";

export class URL {
  private static apiUrl = "https://api.ubersetzer.io";
  private static apiVersion = "v1";
  private static storage = new Storage();

  public static get authLogin() {
    return (): string => `${this.url}/auth/login`;
  }

  public static get baseUrl(): string {
    return this.storage.get("apiUrl") ?? this.apiUrl;
  }

  public static get projectsExportKeys() {
    return (projectId: string): string =>
      `${this.url}/projects/${projectId}/export/keys`;
  }

  public static get url(): string {
    return `${this.baseUrl}/${this.apiVersion}`;
  }
}
