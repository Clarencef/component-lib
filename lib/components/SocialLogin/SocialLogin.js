import React, { PureComponent, PropTypes } from 'react';
import LinkedinLogin from './LinkedinLogin';
import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GoogleLogin';
import publicKeys from './publicKeys';

export default class SocialLogin extends PureComponent {

  static propTypes = {
    signInSocial: PropTypes.func,
  }

  static defaultProps = {
    signInSocial: () => console.log('social sign-in'),
  }

  handleClickSocial = provider => response => {
    const { signInSocial } = this.props;
    const payload = {
      provider,
      code: response.code,
      response,
    };
    signInSocial(payload);
  };

  render () {
    return (
      <div className="social-login-container">
        <FacebookLogin
          appId={publicKeys.fb}
          callback={this.handleClickSocial('facebook')}
          buttonText="Facebook"
          classNames="fb-button"
        />
        <GoogleLogin
          clientId={publicKeys.google}
          onSuccess={this.handleClickSocial('google')}
          buttonText="Google +"
          classNames="google-button"
        />
        <LinkedinLogin
          apiKey={publicKeys.linkedin}
          callback={this.handleClickSocial('Linkedin')}
          buttonText="Linkedin"
          classNames="linkedin-button"
        />
      </div>
    );
  }
}
