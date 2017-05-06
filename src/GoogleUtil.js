import ConsoleLogger from "./ConsoleLogger";

export default class GoogleUtil {

  static signout() {
    return window.gapi.auth2.getAuthInstance().signOut();
  }

  static handleResponse(authResult) {
    if (authResult && authResult.error) {
      ConsoleLogger.error(`there was a problem with authentication: ${JSON.stringify(authResult)}`);
      return false;
    }
    if (!authResult.isSignedIn()) {
      return false;
    }
    return {
      email: authResult.getBasicProfile().getEmail(),
      idToken: authResult.getAuthResponse().id_token
    };
  }

}
