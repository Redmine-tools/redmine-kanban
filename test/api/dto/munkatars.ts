export class Munkatars {
  readonly username: string;
  readonly password: string;
  readonly apiKey: string;

  constructor(username: string, password: string, apiKey: string) {
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
  }
}