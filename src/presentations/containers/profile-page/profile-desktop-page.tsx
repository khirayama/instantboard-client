import * as PropTypes from 'prop-types';
import * as React from 'react';
import { pollRequest } from '../../../action-creators/request';
import { deleteUser, getUser, updateUser } from '../../../action-creators/user';
import poller from '../../../utils/poller';
import tokenManager from '../../../utils/token-manager';
import ApplicationContent from '../../components/application-header/application-content';
import ApplicationHeader from '../../components/application-header/application-header';
import FlatButton from '../../components/flat-button';
import Icon from '../../components/icon';
import Container from '../container';

interface IProfileDesktopPageState {
  isEditing: boolean;
  name: string;
}

export default class ProfileDesktopPage extends Container<{}, IProfileDesktopPageState> {
  public static contextTypes: { move: any } = {
    move: PropTypes.func,
  };

  private handleClickLogoutButton: () => void;

  private handleChangeNameInput: (event: React.FormEvent<HTMLInputElement>) => void;

  private handleBlurNameInput: () => void;

  private handleKeyDownNameInput: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  private handleClickEditButton: () => void;

  private handleClickDeleteAccountButton: () => void;

  constructor(props: IContainerProps) {
    super(props);

    const state: IState = this.getState();

    const { profile }: { profile: IUser | null } = state;
    const initialState: IProfileDesktopPageState = {
      isEditing: false,
      name: profile ? profile.name : '',
    };

    this.state = Object.assign({}, this.getState(), initialState);

    this.actions = {
      pollRequest: (): Promise<{}> => {
        return pollRequest(this.dispatch, { status: 'pending' });
      },
      getUser: (): Promise<{}> => {
        return getUser(this.dispatch);
      },
      updateUser: (newProfile: IUser): Promise<{}> => {
        return updateUser(this.dispatch, newProfile);
      },
      deleteUser: (): Promise<{}> => {
        return deleteUser(this.dispatch);
      },
    };

    this.handleClickLogoutButton = this._handleClickLogoutButton.bind(this);
    this.handleChangeNameInput = this._handleChangeNameInput.bind(this);
    this.handleBlurNameInput = this._handleBlurNameInput.bind(this);
    this.handleKeyDownNameInput = this._handleKeyDownNameInput.bind(this);
    this.handleClickEditButton = this._handleClickEditButton.bind(this);
    this.handleClickDeleteAccountButton = this._handleClickDeleteAccountButton.bind(this);
  }

  public componentDidMount() {
    this.actions.getUser();
    this.actions.pollRequest();
    poller.add(this.actions.pollRequest, 3000);
  }

  public componentWillUnmount() {
    poller.remove(this.actions.pollRequest);

    super.componentWillUnmount();
  }

  public componentDidUpdate(prevProps: IContainerProps, prevState: IProfileDesktopPageState & IState) {
    this.onUpdate(() => {
      const { profile, name }: { profile: IUser | null; name: string } = this.state;
      if (!prevState.profile && profile && profile.name && profile.name !== name) {
        this.setState({
          name: profile.name,
        });
      }
    });
  }

  public render() {
    const profile: IUser | null = this.state.profile;
    const badges: number[] = this.state.requests.length ? [2] : [];

    return (
      <section className="page profile-desktop-page">
        <ApplicationHeader index={3} badges={badges} />
        <ApplicationContent>
          <div className="profile-tab-content--name--input">
            <Icon type="profile" />
            {this.state.isEditing ? (
              <form onSubmit={this.handleBlurNameInput}>
                <input
                  autoFocus
                  type="text"
                  value={this.state.name}
                  onBlur={this.handleBlurNameInput}
                  onChange={this.handleChangeNameInput}
                  onKeyDown={this.handleKeyDownNameInput}
                />
              </form>
            ) : (
              <p onClick={this.handleClickEditButton}>{profile === null ? null : profile.name}</p>
            )}
          </div>
          <div className="profile-desktop-page--logout-button">
            <FlatButton onClick={this.handleClickLogoutButton}>LOG OUT</FlatButton>
          </div>
          <div className="profile-desktop-page--delete-account-button">
            <FlatButton onClick={this.handleClickDeleteAccountButton}>DELETE ACCOUNT</FlatButton>
          </div>
        </ApplicationContent>
      </section>
    );
  }

  private onUpdate(callback: () => void) {
    callback();
  }

  private _handleClickLogoutButton(): void {
    tokenManager.set('');
    this.context.move('/login');
  }

  private _handleChangeNameInput(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ name: event.currentTarget.value });
  }

  private _handleBlurNameInput(): void {
    this.actions.updateUser({
      name: this.state.name.trim(),
    });
    this.setState({ isEditing: false });
  }

  private _handleKeyDownNameInput(event: React.KeyboardEvent<HTMLInputElement>): void {
    const ENTER_KEY: number = 13;
    const keyCode: number = event.keyCode;

    if (keyCode === ENTER_KEY) {
      this.actions.updateUser({
        name: this.state.name.trim(),
      });
      this.setState({ isEditing: false });
    }
  }

  private _handleClickEditButton(): void {
    this.setState({ isEditing: true });
  }

  private _handleClickDeleteAccountButton(): void {
    const isDelete: boolean = window.confirm('Delete account!?'); // eslint-disable-line
    if (isDelete) {
      this.actions.deleteUser().then(() => {
        tokenManager.set('');
        this.context.move('/login');
      });
    }
  }
}
