import * as PropTypes from 'prop-types';
import * as React from 'react';
import queryString from '../../../utils/query-string';
import tokenManager from '../../../utils/token-manager';
import FlatButton from '../../components/flat-button';
import Container from '../container';

const API_SERVER_HOST = process.env.API_SERVER_HOST || 'http://127.0.0.1:3001';

export default class LoginMobilePage extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  private handleClickLoginButton: any;

  constructor(props: any) {
    super(props);

    this.handleClickLoginButton = this._handleClickLoginButton.bind(this);
  }

  public componentWillMount() {
    if (typeof window === 'object') {
      const query = queryString.parse(window.location.search);
      const token = query.token;

      if (token) {
        tokenManager.set(token);

        if (window.opener) {
          window.close();
        } else {
          this.context.move('/');
        }
      }
    }
  }

  public render() {
    return (
      <section className="page login-mobile-page">
        <section className="login-mobile-page--content">
          <h1 className="login-mobile-page--content--heading">
            {'Instantboard'}
          </h1>
          <p className="login-mobile-page--content--description">
            {'Sign up to manage and share your tasks.'}
          </p>
          <FlatButton
            className="login-mobile-page--flat-button login-mobile-page--flat-button__facebook"
            onClick={this.handleClickLoginButton}
            href={`${API_SERVER_HOST}/auth/facebook`}
          >
            {'LOG IN WITH FACEBOOK'}
          </FlatButton>
          {(process.env.NODE_ENV === 'production') ? null : (
            <FlatButton
              className="login-mobile-page--flat-button"
              onClick={this.handleClickLoginButton}
              href={`${API_SERVER_HOST}/auth/tester`}
            >
              {'LOG IN AS TESTER'}
            </FlatButton>
          )}
        </section>
      </section>
    );
  }

  private _handleClickLoginButton(event: any) {
    event.preventDefault();
    const position = 120;
    const width = Math.max(window.parent.screen.width - (position * 2), 375);
    const height = Math.max(window.parent.screen.height - (position * 2), 667);
    const win = window.open(
      event.currentTarget.href,
      '_blank',
      `
        top=${position},
        left=${position},
        width=${width},
        height=${height},
        menubar=no,
        toolbar=no,
        location=yes,
        status=no,
        resizable=yes,
        scrollbars=yes
      `,
    );

    const intervalId = setInterval(() => {
      if (win && win.closed) {
        clearInterval(intervalId);

        const token = tokenManager.get();

        if (token !== null) {
          this.context.move('/');
        }
      }
    }, 500);
  }
}