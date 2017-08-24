import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  TabNavigation,
  TabNavigationContent,
} from '../../components/common/tab-navigation';
import Container from '../container';
import {RequestsTabContent} from './requests-tab-content';

export default class NotificationIndexPage extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  public render() {
    const actions = {
      // UpdateLabel: this.updateLabel.bind(this),
      // deleteLabel: this.deleteLabel.bind(this),
      // sortLabel: this.sortLabel.bind(this),
      // updateTask: this.updateTask.bind(this),
      // deleteTask: this.deleteTask.bind(this),
      // sortTask: this.sortTask.bind(this),
      // acceptRequest: this.acceptRequest.bind(this),
      // refuseRequest: this.refuseRequest.bind(this),
      // updateUser: this.updateUser.bind(this),
      // deleteUser: () => {
      //   clearTabIndex();
      //   const dispatch = this.props.store.dispatch.bind(this.props.store);
      //   deleteUser(dispatch, {accessToken: this.accessToken}).then(() => {
      //     console.log('ok');
      //     this.clearAccessToken();
      //     this.context.move('/login');
      //   });
      // },
      // logout: () => {
      //   clearTabIndex();
      //   this.clearAccessToken();
      //   this.context.move('/login');
      // },
      updateLabel: () => {},
      deleteLabel: () => {},
      sortLabel: () => {},
      updateTask: () => {},
      deleteTask: () => {},
      sortTask: () => {},
      acceptRequest: () => {},
      refuseRequest: () => {},
      updateUser: () => {},
      deleteUser: () => {},
      logout: () => {},
    };
    const ui = this.state.ui;
    const requests = this.state.requests;

    return (
      <section className="page main-page">
        <div className="tab-navigation">
          <div className="tab-navigation-content-list tab-navigation-content-list__active">
            <div className="tab-navigation-content-list-item">
              <RequestsTabContent
                actions={actions}
                ui={ui}
                requests={requests}
              />
            </div>
          </div>
          <TabNavigation index={2}/>
        </div>
      </section>
    );
  }
}