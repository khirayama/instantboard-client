import * as PropTypes from 'prop-types';
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import { TRANSITION_TIME_BASIC } from 'presentations/constants';

interface ISheetProps {
  isShown: boolean;
  onClickBackground(event: React.MouseEvent<HTMLElement>): void;
}

export class Sheet extends React.Component<ISheetProps, {}> {
  private onClickContent: (event: React.MouseEvent<HTMLElement>) => void;

  constructor(props: ISheetProps) {
    super(props);

    this.onClickContent = this.handleClickContent.bind(this);
  }

  public render(): JSX.Element {
    const { isShown, onClickBackground } = this.props;

    return (
      <CSSTransition
        in={isShown}
        timeout={TRANSITION_TIME_BASIC}
        classNames={{
          enter: 'sheet__enter',
          enterActive: 'sheet__enter-active',
          enterDone: 'sheet__enter-done',
          exit: 'sheet__exit',
          exitActive: 'sheet__exit-active',
          exitDone: 'sheet__exit-done',
        }}
      >
        <div role="button" className="sheet" onClick={onClickBackground}>
          <div role="button" className="sheet--content" onClick={this.onClickContent}>
            {this.props.children}
          </div>
        </div>
      </CSSTransition>
    );
  }

  private handleClickContent(event: React.MouseEvent<HTMLElement>): void {
    event.stopPropagation();
  }
}
