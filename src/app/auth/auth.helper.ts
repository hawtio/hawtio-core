namespace Core {

  export function getBasicAuthHeader(username: string, password: string): string {
    let authInfo = username + ":" + password;
    authInfo = window.btoa(authInfo);
    return "Basic " + authInfo;
  }

}
