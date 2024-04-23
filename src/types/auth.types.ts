export interface Account {
  accessToken: string;
  email: string;
}

export interface Accounts {
  [key: string]: Account;
}
