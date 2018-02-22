namespace Core {

  export const connectionSettingsKey = 'jvmConnect';

  const DEFAULT_USER: string = 'public';

  /**
   * UserDetails service that represents user credentials and login/logout actions.
   */
  export class UserDetails {

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
        this.clear();
        this.postLogoutTasks.execute(() => {
          log.debug('Logged out.');
        });
      });
    }

    private clear(): void {
      this.username = DEFAULT_USER;
      this.password = null;
      this.token = null;

      // cleanup local storage
      // TODO This should be moved to plugins where the local storage values are added
      let jvmConnect = angular.fromJson(this.localStorage[connectionSettingsKey])
      _.forOwn(jvmConnect, (property) => {
        delete property['userName'];
        delete property['password'];
      });
      this.localStorage.setItem(connectionSettingsKey, angular.toJson(jvmConnect));
      this.localStorage.removeItem('activemqUserName');
      this.localStorage.removeItem('activemqPassword');
    }
  }

}
