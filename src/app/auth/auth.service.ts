namespace Core {

  const DEFAULT_USER: string = 'public';

  /**
   * @deprecated TODO Temporal type alias to avoid breaking existing code
   */
  export type UserDetails = AuthService;

  /**
   * UserDetails service that represents user credentials and login/logout actions.
   */
  export class AuthService {

    private _username: string = DEFAULT_USER;
    private _password: string = null;
    private _token: string = null;
    private _loggedIn: boolean = false;

    constructor(
      private postLoginTasks: Tasks,
      private preLogoutTasks: Tasks,
      private postLogoutTasks: Tasks,
      private localStorage: Storage) {
      'ngInject';
    }

    /**
     * Log in as a specific user.
     */
    login(username: string, password: string, token?: string): void {
      this._username = username;
      this._password = password;
      if (token) {
        this._token = token;
      }
      this._loggedIn = true;
      log.info('Logged in as', this._username);
      this.postLoginTasks.execute();
    }

    /**
     * Log out the current user.
     */
    logout(): void {
      if (!this._loggedIn) {
        log.debug('Not logged in');
        return;
      }
      this.preLogoutTasks.execute(() => {
        let username = this._username;

        // do logout
        this.clear();

        this.postLogoutTasks.execute(() => {
          log.info('Logged out:', username);
        });
      });
    }

    private clear(): void {
      this._username = DEFAULT_USER;
      this._password = null;
      this._token = null;
      this._loggedIn = false;
    }

    get username(): string {
      return this._username;
    }

    get password(): string {
      return this._password;
    }

    get token(): string {
      return this._token;
    }

    get loggedIn(): boolean {
      return this._loggedIn;
    }
  }

}
