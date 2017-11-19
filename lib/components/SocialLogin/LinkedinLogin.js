import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Atoms } from 'components';

export default class LinkedinLogin extends PureComponent {

  static propTypes = {
    apiKey: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    fields: PropTypes.array,
  }

  static defaultProps = {
    fields: ['id', 'firstName', 'lastName', 'emailAddress'],
  }

  constructor (props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  componentDidMount () {
    this.loadSDK();
  }

  loadSDK () {
    const {
      apiKey,
      scope,
    } = this.props;
    ((d, s, id, cb) => {
      if (d.getElementById('linkedin-login')) {
        return;
      }
      const fjs = d.getElementsByTagName(s)[0];
      let js = d.createElement('script');
      js.src = '//platform.linkedin.com/in.js?async=true';
      js.id = id;
      fjs.parentNode.appendChild(js);
      js.onload = cb;
    })(document, 'script', 'linkedin-login', () => {
      window.IN.init({
        api_key: apiKey,
        authorize: true,
      });
    });
  }

  signIn () {
    window.IN.User.authorize(() => this.checkLoginState()
      .then(this.getUserProfile)
      .catch((e) => console.log(e))
    );
  }

  checkLoginState () {
    return new Promise((resolve, reject) => {
      if (!window.IN.User.isAuthorized()) {
        return reject('Not authenticated');
      }
      return resolve('authenticated');
    });
  }

  getUserProfile () {
    const {
      fields,
      callback,
    } = this.props;
    return new Promise((resolve, reject) => {
      window.IN.API.Profile('me')
      .fields(fields)
      .result((profile) => callback(profile))
      .error((err) => console.log('Failed to get user profile'));
    });
  }

  render () {

    const {
      buttonText,
    } = this.props;
    const { Button } = Atoms;

    return (
      <Button
        theme="linkedin"
        onClick={this.signIn}
      >
        <span>
          {buttonText}
        </span>
      </Button>
    );
  }
}
