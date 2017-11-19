import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
        />
        <GoogleLogin
          clientId={publicKeys.google}
          onSuccess={this.handleClickSocial('google')}
          buttonText="Google +"
        />
        <LinkedinLogin
          apiKey={publicKeys.linkedin}
          callback={this.handleClickSocial('Linkedin')}
          buttonText="Linkedin"
        />
      </div>
    );
  }
}
