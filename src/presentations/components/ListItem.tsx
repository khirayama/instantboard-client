import {
  THRESHOLD_HOLD_TIME,
  THRESHOLD_SCROLL_HEIGHT,
  TRANSITION_TIME,
  transitionProperties,
} from 'presentations/constants';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import Transition from 'react-transition-group/Transition';

export default class ListItem extends React.Component<any, any> {
  private static contextTypes = {
    listElement: PropTypes.func,
    onSort: PropTypes.func,
  };

  private listItem: any;

  private pointer: any;

  private timerId: any;

  private touch: any;

  private mouse: any;

  private setListItem: any;

  private handleMouseDown: any;

  private handleMouseMove: any;

  private handleMouseUp: any;

  private handleClick: any;

  private handleTouchStart: any;

  private handleTouchMove: any;

  private handleTouchEnd: any;

  constructor(props: any) {
    super(props);

    this.pointer = {
      startX: null,
      startY: null,
      startScrollTop: null,
      startTime: new Date(),
      endX: null,
      endY: null,
      endTime: new Date(),
    };

    // Desktop
    this.mouse = {
      down: false,
      clickable: true,
    };

    // Mobile
    this.touch = {
      timerId: null,
      holding: false,
    };

    this.setListItem = this._setListItem.bind(this);
    this.handleMouseDown = this._handleMouseDown.bind(this);
    this.handleMouseMove = this._handleMouseMove.bind(this);
    this.handleMouseUp = this._handleMouseUp.bind(this);
    this.handleClick = this._handleClick.bind(this);
    this.handleTouchStart = this._handleTouchStart.bind(this);
    this.handleTouchMove = this._handleTouchMove.bind(this);
    this.handleTouchEnd = this._handleTouchEnd.bind(this);
  }

  public componentDidMount() {
    // Can't prevent event passive in Chrome.
    // because not use onTouchMove
    this.listItem.addEventListener('touchmove', this.handleTouchMove);
  }

  public componentWillUnount() {
    this.listItem.removeEventListener('touchmove', this.handleTouchMove);
  }

  public render() {
    const { children, key, onExited } = this.props;
    const className = 'list-item';
    const props: any = { ...this.props };
    props.className = props.className ? props.className + ' ' + className : className;
    delete props.appear;
    delete props.enter;
    delete props.exit;
    delete props.onExited;
    delete props.in;

    let listHeight: number = 0;

    const handleEnter = () => {
      const el = this.listItem;
      listHeight = el.offsetHeight;
      el.style.minHeight = 'auto';
      el.style.maxHeight = '0px';
      el.style.transitionProperty = transitionProperties.MAX_HEIGHT;
    };

    const handleEntering = () => {
      const el = this.listItem;
      setTimeout(() => {
        el.style.maxHeight = listHeight + 'px';
      }, 0);
    };

    const handleEntered = () => {
      const el = this.listItem;
      el.style.minHeight = listHeight + 'px';
      el.style.maxHeight = '';
      el.style.transitionProperty = '';
      listHeight = 0;
    };

    const handleExit = () => {
      const el = this.listItem;
      listHeight = el.offsetHeight;

      el.style.height = listHeight + 'px';
      el.style.minHeight = 'auto';
      el.style.transitionProperty = transitionProperties.HEIGHT;
    };

    const handleExiting = () => {
      const el = this.listItem;
      setTimeout(() => {
        el.style.height = '0px';
      }, 0);
    };

    const handleExited = () => {
      onExited();
    };

    return (
      <Transition
        key={key}
        in={this.props.in} // eslint-disable-line
        timeout={TRANSITION_TIME}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExiting={handleExiting}
        onExited={handleExited}
      >
        <li
          {...props}
          ref={this.setListItem}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onClick={this.handleClick}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
        >
          {children}
        </li>
      </Transition>
    );
  }

  // Handling event
  private _handleClick(event: any) {
    const { onClick } = this.props;

    if (this.mouse.clickable && onClick) {
      onClick(event);
    }
  }

  private _handleMouseDown(event: any) {
    const { listElement } = this.context;

    this.mouse.down = true;
    this.pointer = {
      ...this.pointer,
      startX: event.clientX,
      startY: event.clientY,
      startScrollTop: listElement().scrollTop,
      startTime: new Date(),
    };
  }

  private _handleMouseMove(event: any) {
    const { onSort } = this.context;

    if (this.mouse.down) {
      this.mouse.clickable = false;
      this.pointer = {
        ...this.pointer,
        endX: event.clientX,
        endY: event.clientY,
        endTime: new Date(),
      };

      if (onSort) {
        this.updatePointerMoveView();
      }
    }
  }

  private _handleMouseUp() {
    const { onSort } = this.context;

    this.updatePointerUpView();

    const { currentIndex, targetIndex } = this.calcIndex();

    if (currentIndex !== null && targetIndex !== null && onSort) {
      onSort(currentIndex, targetIndex);
    }

    this.mouse.down = false;
    this.mouse.clickable = this.mouse.clickable;
    this.pointer = {
      startX: null,
      startY: null,
      startScrollTop: null,
      endX: null,
      endY: null,
    };
    setTimeout(() => {
      this.mouse.clickable = true;
    }, 0);
  }

  private _handleTouchStart(event: any) {
    const { listElement } = this.context;
    this.touch.timerId = setTimeout(this._handleTouchHold.bind(this), THRESHOLD_HOLD_TIME);
    this.pointer = {
      ...this.pointer,
      startX: event.touches[0].clientX,
      startY: event.touches[0].clientY,
      startScrollTop: listElement().scrollTop,
      startTime: new Date(),
    };
  }

  private _handleTouchMove(event: any) {
    const { onSort } = this.context;

    if (this.touch.holding) {
      event.stopPropagation();
      event.preventDefault();
    }

    const distance = Math.sqrt(
      Math.pow(event.touches[0].clientX - this.pointer.startX, 2) +
        Math.pow(event.touches[0].clientY - this.pointer.startY, 2),
    );

    if (distance > 10) {
      clearTimeout(this.touch.timerId);

      this.pointer = {
        ...this.pointer,
        endX: event.touches[0].clientX,
        endY: event.touches[0].clientY,
        endTime: new Date(),
      };

      if (this.touch.holding && onSort) {
        this.updatePointerMoveView();
      }
    }
  }

  private _handleTouchHold() {
    const { onSort } = this.context;
    const { onTouchHold } = this.props;
    this.touch.holding = true;

    if (onTouchHold || onSort) {
      this.updateTouchHoldView();
    }

    if (onTouchHold) {
      onTouchHold();
    }
  }

  private _handleTouchEnd() {
    const { onSort } = this.context;
    clearTimeout(this.touch.timerId);

    this.updatePointerUpView();

    const { currentIndex, targetIndex } = this.calcIndex();
    if (this.touch.holding && currentIndex !== null && targetIndex !== null && onSort) {
      onSort(currentIndex, targetIndex);
    }

    this.touch.timerId = null;
    this.touch.holding = false;
    this.pointer = {
      startX: null,
      startY: null,
      startScrollTop: null,
      startTime: new Date(),
      endX: null,
      endY: null,
      endTime: new Date(),
    };
  }

  // Update views
  private updatePointerMoveView() {
    const { listElement } = this.context;

    listElement().classList.add('list__sorting');
    this.listItem.classList.add('list-item__sorting');

    this.moveCurrentListItemAnimation();
    this.moveListItemAnimation();
    this.scrollListView();
  }

  private updatePointerUpView() {
    const { listElement } = this.context;
    if (this.listItem.classList.contains('list-item__holding')) {
      this.listItem.classList.remove('list-item__holding');
    }
    if (this.listItem.classList.contains('list-item__sorting')) {
      this.listItem.classList.remove('list-item__sorting');
    }

    const listItemElements = listElement().querySelectorAll('.list-item');

    for (const listItemElement of listItemElements) {
      listItemElement.style.transform = 'translateY(0px)';
      listItemElement.style.transitionProperty = transitionProperties.HEIGHT;
    }
  }

  private updateTouchHoldView() {
    if (!this.listItem.classList.contains('list-item__holding')) {
      this.listItem.style.transitionProperty = transitionProperties.ALL;
      this.listItem.classList.add('list-item__holding');
    }
  }

  // Animation
  private moveCurrentListItemAnimation() {
    const { listElement } = this.context;
    const diff = this.calcDiff();
    const scrollDiff = this.pointer.startScrollTop - listElement().scrollTop;

    this.listItem.style.transitionProperty = transitionProperties.NONE;
    this.listItem.style.transform = `translateY(${diff.y - scrollDiff}px)`;
  }

  private moveListItemAnimation() {
    const { listElement } = this.context;
    const listItemElements = listElement().querySelectorAll('.list-item');

    const height = this.listItem.offsetHeight;

    const { currentIndex, targetIndex } = this.calcIndex();

    if (currentIndex !== null && targetIndex !== null) {
      if (currentIndex <= targetIndex) {
        for (let index = 0; index < listItemElements.length; index++) {
          const listItemElement = listItemElements[index];

          if (currentIndex < index && index <= targetIndex) {
            listItemElement.style.transitionProperty = transitionProperties.TRANSFORM;
            listItemElement.style.transform = `translateY(-${height}px)`;
          } else if (currentIndex !== index) {
            listItemElement.style.transitionProperty = transitionProperties.TRANSFORM;
            listItemElement.style.transform = 'translateY(0px)';
          }
        }
      }
      if (targetIndex <= currentIndex) {
        for (let index = 0; index < listItemElements.length; index++) {
          const listItemElement = listItemElements[index];

          if (targetIndex <= index && index < currentIndex) {
            listItemElement.style.transitionProperty = transitionProperties.TRANSFORM;
            listItemElement.style.transform = `translateY(${height}px)`;
          } else if (currentIndex !== index) {
            listItemElement.style.transitionProperty = transitionProperties.TRANSFORM;
            listItemElement.style.transform = 'translateY(0px)';
          }
        }
      }
    }
  }

  private scrollListView() {
    const { listElement } = this.context;
    const listContentElement = listElement().querySelector('.list-content');
    const listElementRect = listElement().getBoundingClientRect();

    if (!this.timerId) {
      this.timerId = setInterval(() => {
        if (
          this.pointer.endY &&
          listElement().scrollTop > 0 &&
          this.pointer.endY < listElementRect.top + THRESHOLD_SCROLL_HEIGHT
        ) {
          listElement().scrollTop -= 3;
          this.moveCurrentListItemAnimation();
          this.moveListItemAnimation();
        } else if (
          this.pointer.endY &&
          listElement().scrollTop < listContentElement.offsetHeight - listElement().offsetHeight &&
          this.pointer.endY > listElementRect.top + listElement().offsetHeight - THRESHOLD_SCROLL_HEIGHT
        ) {
          listElement().scrollTop += 3;
          this.moveCurrentListItemAnimation();
          this.moveListItemAnimation();
        } else {
          clearTimeout(this.timerId);
          this.timerId = null;
        }
      }, 1000 / 60);
    }
  }

  private calcDiff() {
    let x = this.pointer.endX - this.pointer.startX;
    let y = this.pointer.endY - this.pointer.startY;
    let time = this.pointer.endTime.getTime() - this.pointer.startTime.getTime();

    time = time < 0 ? 0 : time;

    if (this.pointer.endX === null || this.pointer.endY === null) {
      x = 0;
      y = 0;
    }
    return {
      x,
      y,
      time,
      delta: {
        x: Number((x / time).toFixed(2)),
        y: Number((y / time).toFixed(2)),
      },
    };
  }

  private calcIndex() {
    const { listElement } = this.context;
    const listItemElements = listElement().querySelectorAll('.list-item');

    const scrollTop = listElement().scrollTop;
    const listRect = listElement().getBoundingClientRect();
    const listTop = listRect.top;
    const listHeight = listRect.height;

    let currentIndex: number | null = null;
    let targetIndex: number | null = null;

    if (
      this.pointer.startX !== null &&
      this.pointer.startY !== null &&
      this.pointer.endX !== null &&
      this.pointer.endY !== null
    ) {
      for (let index = 0; index < listItemElements.length; index++) {
        const listItemElement = listItemElements[index];
        const targetRect = {
          top: listTop + listItemElement.offsetTop,
          height: listItemElement.offsetHeight,
        };

        if (listItemElement === this.listItem) {
          currentIndex = index;
        }
        if (this.pointer.endY < listTop) {
          targetIndex = 0;
        } else if (listTop + listHeight < this.pointer.endY) {
          targetIndex = listItemElements.length - 1;
        } else if (
          this.pointer.endX !== null &&
          this.pointer.endY !== null &&
          targetRect.top - scrollTop < this.pointer.endY &&
          this.pointer.endY < targetRect.top + targetRect.height - scrollTop
        ) {
          targetIndex = index;
        }
      }
    }

    return {
      currentIndex,
      targetIndex,
    };
  }

  private _setListItem(listItem: any) {
    this.listItem = listItem;
  }
}