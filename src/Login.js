import GoogleLogin from "react-google-login";
import React from "react";
import PropTypes from "prop-types";
import APPCONFIG from "./config.json";
import AwsUtil from "./AwsUtil";
import ConsoleLogger from "./ConsoleLogger";

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.handleGoogleLoginSuccess = this.handleGoogleLoginSuccess.bind(this);
    this.handleGoogleLoginFailure = this.handleGoogleLoginFailure.bind(this);
    this.handleGoogleSignout = this.handleGoogleSignout.bind(this);
  }

  componentWillMount() {
    this.setState({ loggedIn: false });
  }

  handleGoogleLoginSuccess(authResult) {
    if (authResult === undefined || authResult === false
      || (authResult && (authResult.error || !authResult.isSignedIn()))) {
      this.setState({ loggedIn: false });
      ConsoleLogger.error(`Login was not successful: + ${JSON.stringify(authResult)}`);
      this.props.onLoginFailure();
    } else {
      const user = {
        email: authResult.getBasicProfile().getEmail(),
        idToken: authResult.getAuthResponse().id_token
      };
      AwsUtil.bindOpenId(user.idToken).then(() => {
        this.setState({ loggedIn: true });
        this.props.onLoginSuccess(user);
      }).catch((error) => {
        ConsoleLogger.error("Something went wrong while binding open id to aws credentials!");
        ConsoleLogger.error(JSON.stringify(error));
        this.props.onLoginFailure();
      });
    }
  }

  handleGoogleLoginFailure(error) {
    this.setState({ loggedIn: false });
    ConsoleLogger.error(`Login to Google failed: ${JSON.stringify(error)}`);
    this.props.onLoginFailure();
  }

  handleGoogleSignout() {
    this.props.onBeforeLogOut();
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      AwsUtil.resetAWSLogin();
      this.setState({ loggedIn: false });
      this.props.onLoggedOut(); // this.resetState();
    });
  }

  render() {
    return (
      <div className="login-out">
        {!this.state.loggedIn
          ? <GoogleLogin
            className="login-button"
            clientId={APPCONFIG.OAUTH.GOOGLE.APP_KEY}
            buttonText="Login"
            onSuccess={this.handleGoogleLoginSuccess}
            onFailure={this.handleGoogleLoginFailure}
            offline={false}
            autoLoad={false}
            scope="email"
            >
              <span>Login with Google</span>
            </GoogleLogin>
          : <button className="button logout-button" onClick={this.handleGoogleSignout}>
              <span>bye</span>
            </button>
        }
      </div>
    );
  }

}

Login.propTypes = {
  onBeforeLogOut: PropTypes.func.isRequired,
  onLoggedOut: PropTypes.func.isRequired,
  onLoginFailure: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired
};
