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

    username: string = DEFAULT_USER;
    password: string = null;
    token: string = null;

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
      this.username = username;
      this.password = password;
      if (token) {
        this.token = token;
      }
      this.postLoginTasks.execute(() => {
        log.info('Logged in as', this.username);
      });
    }

    /**
     * Log out the current user.
     */
    logout(): void {
      this.preLogoutTasks.execute(() => {
        let username = this.username;
        this.clear();
        this.postLogoutTasks.execute(() => {
          log.info('Logged out:', username);
        });
      });
    }

    private clear(): void {
      this.username = DEFAULT_USER;
      this.password = null;
      this.token = null;
    }
  }

}
