import React, { PureComponent, PropTypes } from 'react';
import { getIsMobile } from './utils';
import serialize from 'utils/serialize';

export default class FacebookLogin extends PureComponent {
  static propTypes= {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    buttonText: PropTypes.string,
    classNames: PropTypes.string,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    version: PropTypes.string,
    language: PropTypes.string,
    fields: PropTypes.string,
    scope: PropTypes.string,
    redirectUri: PropTypes.string,
    reAuthenticate: PropTypes.bool,
    disableMobileRedirect: PropTypes.bool,
    isMobile: PropTypes.bool,
    onFailure: PropTypes.func,
  }

  static defaultProps = {
    buttonText: 'Facebook',
    classNames: 'fb-button',
    xfbml: false,
    cookie: true,
    version: 'v2.10',
    language: 'en_US',
    fields: 'first_name,last_name,email',
    scope: 'public_profile,email',
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    reAuthenticate: false,
    disableMobileRedirect: false,
    isMobile: getIsMobile(),
    onFailure: () => console.log('failure to check login state'),
  }

  constructor (props) {
    super(props);
    this.state = {
      isSdkLoaded: false,
      isProcessing: false,
    };
  }

  componentDidMount () {
    this._isMounted = true;
    if (document.getElementById('facebook-jssdk')) {
      this.sdkLoaded();
      return;
    }
    this.setFbAsyncInit();
    this.loadSdkAsynchronously();
    let fbRoot = document.getElementById('fb-root');
    if (!fbRoot) {
      fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  }

  componentWillUnmount () {
    this._isMounted = false;
  }

  loadSdkAsynchronously () {
    const { language } = this.props;
    ((d, s, id) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = `https://connect.facebook.net/${language}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  setStateIfMounted (state) {
    if (this._isMounted) {
      this.setState(state);
    }
  }

  sdkLoaded () {
    this.setState({ isSdkLoaded: true });
  }

  setFbAsyncInit () {
    const {
      appId,
      xfbml,
      cookie,
      version,
    } = this.props;
    window.fbAsyncInit = () => {
      window.FB.init({
        version: `${version}`,
        appId,
        xfbml,
        cookie,
      });
      this.setStateIfMounted({ isSdkLoaded: true });
      if (window.location.search.includes('facebookdirect')) {
        window.FB.getLoginStatus(this.checkLoginAfterRefresh);
      }
    };
  }

  checkLoginAfterRefresh = (response) => {
    if (response.status === 'connected') {
      this.checkLoginState(response);
    } else {
      window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    }
  };

  checkLoginState = (response) => {
    this.setStateIfMounted({ isProcessing: false });
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      this.props.onFailure();
    }
  };

  responseApi = (authResponse) => {
    const {
      language,
      fields,
      callback,
    } = this.props;
    window.FB.api('/me', { locale: language, fields }, (me) => {
      Object.assign(me, authResponse);
      callback(me);
    });
  };

  click = (e) => {
    const {
      isSdkLoaded,
      isProcessing,
    } = this.state;
    const {
      scope,
      appId,
      reAuthenticate,
      redirectUri,
      disableMobileRedirect,
      isMobile,
    } = this.props;

    if (!isSdkLoaded || isProcessing) {
      return;
    }

    this.setState({ isProcessing: true });

    const params = {
      client_id: appId,
      redirect_uri: redirectUri,
      state: 'facebookdirect',
      scope,
    };

    if (reAuthenticate) {
      params.auth_type = 'reauthenticate';
    }

    if (isMobile && !disableMobileRedirect) {
      window.location.href = `//www.facebook.com/dialog/oauth?${serialize(params)}`;
    } else {
      window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type });
    }
  };

  render () {
    const {
      buttonText,
      classNames,
    } = this.props;
    return (
      <button
        className={classNames}
        onClick={this.click}
      >
        <i
          className="fa fa-facebook"
          aria-hidden="true"
        />
        <span>{buttonText}</span>
      </button>
    );
  }
}
