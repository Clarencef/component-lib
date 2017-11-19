import React, { Component } from 'react';
import { SocialLogin } from 'components';

export default class App extends Component {
  render () {
    return (
      <div className="main-container">
        <p>This is my new react app</p>
        <SocialLogin />
      </div>
    )
  }
}
