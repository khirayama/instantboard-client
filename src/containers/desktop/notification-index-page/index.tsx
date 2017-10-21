import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  fetchRequest,
  updateRequest,
} from '../../../action-creators/request';
import {
  pollRequest,
} from '../../../action-creators/request';
import {
  ApplicationContent,
  ApplicationHeader,
} from '../../../components/common/application-header';
import Indicator from '../../../components/indicator';
import {List} from '../../../components/list';
import poller from '../../../utils/poller';
import Container from '../../container';
import NoNotificationContent from './no-notification-content';
import RequestListItem from './request-list-item';

export default class NotificationIndexPage extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  constructor(props: any) {
    super(props);

    this.actions = {
      pollRequest: () => {
        pollRequest(this.dispatch, {status: 'pending'});
      },
      fetchRequest: () => {
        fetchRequest(this.dispatch, {status: 'pending'});
      },
      updateRequest: (request: IRequestRequest) => {
        updateRequest(this.dispatch, request);
      },
    };
  }

  public componentDidMount() {
    this.actions.fetchRequest();
    poller.add(this.actions.pollRequest, 5000);
  }

  public componentWillUnmount() {
    poller.remove(this.actions.pollRequest);
    super.componentWillUnmount();
  }

  public render() {
    const ui = this.state.ui;
    const requests = this.state.requests;
    const badges = (this.state.requests.length) ? [2] : [];

    return (
      <section className="page notification-index-page">
        <Indicator active={(ui.isLoadingRequests && requests.length !== 0)}/>
        <ApplicationHeader
          index={2}
          badges={badges}
        />
        <ApplicationContent>
          <List className="request-list">
            {requests.map((request: IRequest) => {
              return (
                <RequestListItem
                  key={request.id}
                  actions={this.actions}
                  request={request}
                />
              );
            })}
          </List>
          {(requests.length === 0) ? <NoNotificationContent/> : null}
        </ApplicationContent>
      </section>
    );
  }
}
