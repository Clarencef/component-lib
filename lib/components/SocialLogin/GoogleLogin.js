import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Atoms } from 'components';

export default class GoogleLogin extends PureComponent {
  static propTypes = {
    clientId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func,
    onRequest: PropTypes.func,
    cookiePolicy: PropTypes.string,
    autoLoad: PropTypes.bool,
    isSignedIn: PropTypes.bool,
    fetchBasicProfile: PropTypes.bool,
    uxMode: PropTypes.string,
    buttonText: PropTypes.string,
    classNames: PropTypes.string,
  };

  static defaultProps = {
    onFailure: () => console.log('failure'),
    onRequest: () => console.log('on request'),
    cookiePolicy: 'single_host_origin',
    autoLoad: false,
    isSignedIn: false,
    fetchBasicProfile: true,
    uxMode: 'popup',
    buttonText: 'Google +',
    classNames: 'google-button',
  };

  constructor (props) {
    super(props);
    this.state = {
      disable: true,
    };
  }

  componentDidMount () {
    const {
      clientId,
      cookiePolicy,
      autoLoad,
      isSignedIn,
      fetchBasicProfile,
      onFailure,
      uxMode,
    } = this.props;

    ((d, s, id, cb) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      js = d.createElement(s);
      js.id = id;
      js.src = '//apis.google.com/js/client:platform.js';
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = cb;
    })(document, 'script', 'google-login', () => {
      const params = {
        client_id: clientId,
        cookiepolicy: cookiePolicy,
        fetch_basic_profile: fetchBasicProfile,
        ux_mode: uxMode,
      };
      window.gapi.load('auth2', () => {
        this.setState({
          disabled: false,
        });
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init(params).then(
            res => {
              if (isSignedIn && res.isSignedIn.get()) {
                this.handleSigninSuccess(res.currentUser.get());
              }
            },
            err => onFailure(err)
          );
        }
        if (autoLoad) {
          this.signIn();
        }
      });
    });
  }

  handleSigninSuccess = res => {
    const basicProfile = res.getBasicProfile();
    const authResponse = res.getAuthResponse();
    res.googleId = basicProfile.getId();
    res.tokenObj = authResponse;
    res.tokenId = authResponse.id_token;
    res.accessToken = authResponse.access_token;
    res.profileObj = {
      googleId: basicProfile.getId(),
      imageUrl: basicProfile.getImageUrl(),
      email: basicProfile.getEmail(),
      name: basicProfile.getName(),
      givenName: basicProfile.getGivenName(),
      familyName: basicProfile.getFamilyName(),
    };
    this.props.onSuccess(res);
  };

  signIn = e => {
    e.preventDefault();
    const { disabled } = this.state;
    if (!disabled) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const {
        onSuccess,
        onRequest,
        onFailure,
        fetchBasicProfile,
        prompt,
        scope,
        responseType,
      } = this.props;
      const options = {
        response_type: responseType,
        fetch_basic_profile: fetchBasicProfile,
        prompt,
        scope,
      };
      onRequest();
      if (responseType === 'code') {
        auth2
          .grantOfflineAccess(options)
          .then(res => onSuccess(res), err => onFailure(err));
      } else {
        auth2
          .signIn(options)
          .then(res => this.handleSigninSuccess(res), err => onFailure(err));
      }
    }
  };

  render () {
    const {
      buttonText,
    } = this.props;
    const { Button } = Atoms;
    return (
      <Button
        onClick={this.signIn}
        theme="google"
      >
        <span>
          {buttonText}
        </span>
      </Button>
    );
  }
}
