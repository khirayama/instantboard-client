/* eslint-disable capitalized-comments */
/* tslint:disable:max-line-length */
import * as classNames from 'classnames';
import * as React from 'react';

/*
 * Support icons
 * - check
 * - remove
 * - list
 * - label
 * - add
 * - close
 * - notification
 * - profile
 * - send
 * - back
 * - edit
*/

export default class Icon extends React.Component<any, any> {
  public render() {
    const { className, active, type } = this.props;
    let icon: any = null;
    const strokeWidth = 3;

    switch (type) {
      case 'check': {
        icon = (
          <g stroke="none" fill="none">
            <circle className="icon__check--circle" />
            <circle className="icon__check--circle--inner" />
          </g>
        );
        break;
      }
      case 'remove': {
        icon = (
          <g stroke="none" fill="none">
            <rect className="icon__remove--rect" />
          </g>
        );
        break;
      }
      case 'list': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              d="M16,36 C12.6862915,36 10,33.3137085 10,30 C10,26.6862915 12.6862915,24 16,24 C19.3137085,24 22,26.6862915 22,30 C22,33.3137085 19.3137085,36 16,36 Z M16,76 C12.6862915,76 10,73.3137085 10,70 C10,66.6862915 12.6862915,64 16,64 C19.3137085,64 22,66.6862915 22,70 C22,73.3137085 19.3137085,76 16,76 Z M16,56 C12.6862915,56 10,53.3137085 10,50 C10,46.6862915 12.6862915,44 16,44 C19.3137085,44 22,46.6862915 22,50 C22,53.3137085 19.3137085,56 16,56 Z M34,46 L86,46 C88.209139,46 90,47.790861 90,50 C90,52.209139 88.209139,54 86,54 L34,54 C31.790861,54 30,52.209139 30,50 C30,47.790861 31.790861,46 34,46 Z M34,26 L86,26 C88.209139,26 90,27.790861 90,30 L90,30 C90,32.209139 88.209139,34 86,34 L34,34 C31.790861,34 30,32.209139 30,30 L30,30 L30,30 C30,27.790861 31.790861,26 34,26 Z M34,66 L86,66 C88.209139,66 90,67.790861 90,70 C90,72.209139 88.209139,74 86,74 L34,74 C31.790861,74 30,72.209139 30,70 C30,67.790861 31.790861,66 34,66 Z"
            />
          </g>
        );
        break;
      }
      case 'label': {
        icon = (
          <g
            stroke="none"
            fill="none"
            transform="translate(50.000000, 49.922087) rotate(-315.000000) translate(-50.000000, -49.922087)"
          >
            <path
              strokeWidth={strokeWidth}
              d="M32.2026746,29.570171 C31.4456847,30.1365969 31,31.0267266 31,31.9721746 L31,79.8441749 C31,81.5010291 32.3431458,82.8441749 34,82.8441749 L66,82.8441749 C67.6568542,82.8441749 69,81.5010291 69,79.8441749 L69,31.9721746 C69,31.0267266 68.5543153,30.1365969 67.7973254,29.570171 L51.7973254,17.5979964 C50.7317499,16.8006679 49.2682501,16.8006679 48.2026746,17.5979964 L32.2026746,29.570171 Z M50,36.672602 C47.2385763,36.672602 45,34.4340258 45,31.672602 C45,28.9111783 47.2385763,26.672602 50,26.672602 C52.7614237,26.672602 55,28.9111783 55,31.672602 C55,34.4340258 52.7614237,36.672602 50,36.672602 Z"
            />
          </g>
        );
        break;
      }
      case 'add': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              d="M55,45 L66,45 C68.7614237,45 71,47.2385763 71,50 C71,52.7614237 68.7614237,55 66,55 L55,55 L55,66 C55,68.7614237 52.7614237,71 50,71 C47.2385763,71 45,68.7614237 45,66 L45,55 L34,55 C31.2385763,55 29,52.7614237 29,50 C29,47.2385763 31.2385763,45 34,45 L45,45 L45,34 C45,31.2385763 47.2385763,29 50,29 C52.7614237,29 55,31.2385763 55,34 L55,45 Z M30,19 C23.9248678,19 19,23.9248678 19,30 L19,70 C19,76.0751322 23.9248678,81 30,81 L70,81 C76.0751322,81 81,76.0751322 81,70 L81,30 C81,23.9248678 76.0751322,19 70,19 L30,19 Z"
            />
          </g>
        );
        break;
      }
      case 'close': {
        // TODO: Create new icon for close. For now, I use remove icon instead of it.
        icon = (
          <g stroke="none" fill="none">
            <rect className="icon__close--rect" />
          </g>
        );
        break;
      }
      case 'notification': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              d="M50.0001018,78 C45.5818238,78 42.0001018,73.418278 42.0001018,69 L58.0001018,69 C58.0001018,73.418278 54.4183798,78 50.0001018,78 Z M50.0001018,23 C68.0001018,23 70.0001018,38 70.0001018,58 C72.6893276,62 74.0226609,64 74.0001018,64 L26.0001018,64 C25.9865782,64 27.3199116,62 30.0001018,58 C30.0001018,38 32.0001018,23 50.0001018,23 Z"
            />
          </g>
        );
        break;
      }
      case 'profile': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              d="M50,51 C42.2680135,51 36,44.7319865 36,37 C36,29.2680135 42.2680135,23 50,23 C57.7319865,23 64,29.2680135 64,37 C64,44.7319865 57.7319865,51 50,51 Z M50,77.0555556 C31.2739605,77.0555556 21.2739605,75.7222222 20,73.0555556 C20,53.0555556 37,58 50,58 C63,58 80.0799866,53.0555556 80,73.0555556 C78.7260395,75.7222222 68.7260395,77.0555556 50,77.0555556 Z"
            />
          </g>
        );
        break;
      }
      case 'send': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              d="M20.2661107,21.3836035 L84.9814101,42.3723492 L84.9814101,42.3723492 C86.0321018,42.7131141 86.6076112,43.8411125 86.2668463,44.8918042 C86.090184,45.4365129 85.6885087,45.879368 85.1635715,46.1081868 L16.2157379,76.1623706 L16.2157379,76.1623706 C15.2031835,76.6037405 14.024545,76.140704 13.5831752,75.1281496 C13.3809092,74.6641276 13.3621163,74.1406704 13.5305864,73.6633385 L23.5290495,45.3343598 L23.5290495,45.3343598 C23.8112695,44.5347365 24.5670646,44 25.4150302,44 L48,44 L48,44 C48.8252161,44 49.494186,43.3310302 49.494186,42.505814 C49.494186,41.7522613 48.9330647,41.1166331 48.185331,41.0231664 L25.1208079,38.140101 L25.1208079,38.140101 C24.4252349,38.0531544 23.8259517,37.6083914 23.5412543,36.9678222 L17.8214782,24.0983261 L17.8214782,24.0983261 C17.3728701,23.0889577 17.827456,21.9070342 18.8368244,21.458426 C19.2877124,21.2580314 19.7967635,21.2313827 20.2661107,21.3836035 Z"
            />
          </g>
        );
        break;
      }
      case 'back': {
        icon = (
          <g stroke="none" fill="none">
            <path
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              d="M45.5033586,77.5968469 L49.500187,73.5978114 L49.4997965,73.5974211 C50.2804771,72.8163094 50.2803024,71.5502805 49.4994062,70.7693844 L33.6377065,54.9069039 L81.8320649,54.9069039 L81.8320649,54.9069039 C82.9366344,54.9069039 83.8320649,54.0114734 83.8320649,52.9069039 L83.8320649,47.2723513 L83.8320649,47.2723513 C83.8320649,46.1677818 82.9366344,45.2723513 81.8320649,45.2723513 L33.6377065,45.2723513 L49.4997966,29.4102612 L49.4997966,29.4102612 C50.2808452,28.6292126 50.2808452,27.3628827 49.4997966,26.5818341 L45.503749,22.5857864 L45.503749,22.5857864 C44.7227004,21.8047379 43.4563705,21.8047379 42.6753219,22.5857864 L16.5856943,48.675414 L16.5857864,48.6755062 C15.8047738,49.4565188 15.8047326,50.7227777 16.5856943,51.5038411 L42.675414,77.5971451 L42.6749316,77.5976275 C43.4559293,78.378727 44.7222592,78.3788095 45.5033587,77.5978118 C45.5035195,77.597651 45.5036803,77.5974901 45.5038411,77.5973292 Z"
            />
          </g>
        );
        break;
      }
      case 'edit': {
        icon = (
          <g
            stroke="none"
            fill="none"
            transform="translate(50.405132, 50.044392) rotate(-45.000000) translate(-50.405132, -50.044392) "
          >
            <path
              strokeWidth={strokeWidth}
              d="M69.5250317,59.088784 L69.5250317,41 L20.8026163,41 C19.9857324,41 19.2041724,41.3331148 18.6384543,41.9224045 L12.835838,47.9667965 C11.7213873,49.1276827 11.7213873,50.9611013 12.835838,52.1219875 L18.6384543,58.1663794 C19.2041724,58.7556691 19.9857324,59.088784 20.8026163,59.088784 L69.5250317,59.088784 Z M76.3463399,41 L76.3463399,59.088784 L85.8102643,59.088784 C87.4671186,59.088784 88.8102643,57.7456382 88.8102643,56.088784 L88.8102643,44 C88.8102643,42.3431458 87.4671186,41 85.8102643,41 L76.3463399,41 Z"
            />
          </g>
        );
        break;
      }
      default: {
        return type;
      }
    }
    const iconActiveClassName = 'icon__active';
    return (
      <svg
        className={classNames('icon', `icon__${type}`, { [iconActiveClassName]: active }, className)}
        viewBox="0 0 100 100"
      >
        {icon}
      </svg>
    );
  }
}
