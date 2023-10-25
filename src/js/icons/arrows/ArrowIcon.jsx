import classNames from 'classnames';
import PropTypes from 'prop-types';

import ComponentsCommonConstants from '@/constants/components/common';

const renderArrow = ({ size, color, isOpened, className = '' }) => {
  switch (size) {
    case 'middle':
      return (
        <svg
          className={classNames(['icon icon-arrow', isOpened && 'rotate-0', className])}
          width="11"
          height="17"
          viewBox="0 0 11 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="-0.723341"
            width="1.45883"
            height="10.1"
            transform="matrix(0.723341 -0.690491 0.723341 0.690491 1.97127 2.16616)"
            fill="#1A1A1A"
            stroke="#1A1A1A"
          />
          <rect
            y="0.690491"
            width="1.45883"
            height="10.1"
            transform="matrix(-0.723341 -0.690491 0.723341 -0.690491 2.00396 16.0875)"
            fill="#1A1A1A"
            stroke="#1A1A1A"
          />
        </svg>
      );
    case ComponentsCommonConstants.Size.LARGE:
      return (
        <svg
          className={classNames(['icon icon-arrow', isOpened && 'rotate-0', className])}
          width="11"
          height="19"
          viewBox="0 0 11 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 1.4L8.2 9.5L0 17.6L1.4 19L9.6 10.9L11 9.5L1.4 0L0 1.4Z" fill={color} />
        </svg>
      );
    case ComponentsCommonConstants.Size.SMALL:
      return (
        <svg
          className={classNames(['icon icon-arrow rotate-0', isOpened && 'rotate-180-minus', className])}
          width="9"
          height="6"
          viewBox="0 0 9 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.5 3.2L1.4 0L0 1.4L4.5 6L9 1.4L7.6 0L4.5 3.2Z" fill={color} />
        </svg>
      );
    case ComponentsCommonConstants.Size.NORMAL:
    default:
      return (
        <svg
          className={classNames(['icon icon-arrow', isOpened && 'rotate-0', className])}
          width="15"
          height="9"
          viewBox="0 0 15 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M1.22392e-07 7.6L1.4 9L7.5 2.8L13.6 9L15 7.6L7.5 -6.55671e-07L1.22392e-07 7.6Z" fill={color} />
          </g>
        </svg>
      );
  }
};

function ArrowIcon({ size, color, isOpened, className }) {
  return renderArrow({
    size,
    color,
    isOpened,
    className,
  });
}

ArrowIcon.defaultProps = {
  size: ComponentsCommonConstants.Size.NORMAL,
  color: '#1A1A1A',
  isOpened: false,
  className: '',
};

ArrowIcon.propTypes = {
  size: PropTypes.oneOf([
    ComponentsCommonConstants.Size.NORMAL,
    ComponentsCommonConstants.Size.LARGE,
    ComponentsCommonConstants.Size.SMALL,
    'middle',
  ]),
  color: PropTypes.string,
  isOpened: PropTypes.bool,
  className: PropTypes.string,
};

export default ArrowIcon;
