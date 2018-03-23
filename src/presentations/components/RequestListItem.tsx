import FlatButton from 'presentations/components/FlatButton';
import Icon from 'presentations/components/Icon';
import ListItem from 'presentations/components/ListItem';
import * as React from 'react';

export default class RequestListItem extends React.Component<any, any> {
  public render() {
    const { request, onClickAcceptButton, onClickRefuseButton } = this.props;

    const handleClickAcceptButton = (event: any) => {
      if (onClickAcceptButton) {
        onClickAcceptButton(event, this.props, this.state);
      }
    };

    const handleClickRefuseButton = (event: any) => {
      if (onClickRefuseButton) {
        onClickRefuseButton(event, this.props, this.state);
      }
    };

    const props: any = { ...this.props };
    delete props.request;
    delete props.onClickAcceptButton;
    delete props.onClickRefuseButton;

    return (
      <ListItem {...props}>
        <div className="request-list-item">
          <div className="request-list-item--information-container">
            <div className="request-list-item--label-name">{request.label.name}</div>
            <div className="request-list-item--description">
              {'From '}
              {request.member.name}
            </div>
          </div>
          <div className="request-list-item--button-container">
            <FlatButton className="request-list-item--accept-button" onClick={handleClickAcceptButton}>
              {'ACCEPT'}
            </FlatButton>
            <FlatButton className="request-list-item--refuse-button" onClick={handleClickRefuseButton}>
              <Icon type="remove" />
            </FlatButton>
          </div>
        </div>
      </ListItem>
    );
  }
}