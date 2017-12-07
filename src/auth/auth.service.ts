namespace Auth {

  export interface AuthService {
    logout(): void;
  }

  export class DummyAuthService implements AuthService {
    logout(): void {
      // do nothing
    }
  }

}
