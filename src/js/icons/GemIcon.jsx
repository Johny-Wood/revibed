import { useMemo } from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

function GemIcon({ size, offset, color, colorUrl, className }) {
  const iconColor = useMemo(() => (color ? `var(--color__${color})` : `url(#${colorUrl})`), [colorUrl, color]);

  return (
    <svg
      className={classNames(['icon icon-gem', className])}
      style={{
        width: size,
        height: size - 1,
        marginRight: offset ? `${size / 6}px` : 0,
      }}
      width={size}
      height={size}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7149 0.0303436L17.7929 3.61755L17.7931 3.61756C17.8416 3.6743 17.8031 3.75926 17.7283 3.75926H13.4631C13.4267 3.75926 13.3944 3.73696 13.3823 3.70464L12.0172 0.115306C11.9969 0.0606882 12.0374 0 12.098 0H14.6502C14.6744 0 14.6987 0.0121371 14.7149 0.0303436ZM5.84916 0.00012207H3.25655C3.23229 0.00012207 3.20802 0.0102836 3.1918 0.0304657L0.126044 3.6198C0.0794921 3.67442 0.118004 3.7615 0.190794 3.7615H4.47588C4.51227 3.7615 4.5426 3.7392 4.55671 3.70688L5.92786 0.117547C5.95015 0.0608117 5.90769 0.000123449 5.849 0.000123449L5.84916 0.00012207ZM0.0856461 4.21509H4.38915L4.38899 4.21525C4.38899 4.23134 4.39294 4.2456 4.39703 4.25971L8.07146 15.8735C8.10179 15.9684 7.97441 16.0291 7.91982 15.9483L0.0148335 4.3486C-0.0235358 4.29201 0.0169497 4.21509 0.0856461 4.21509ZM13.542 4.25955C13.5459 4.24543 13.548 4.23132 13.55 4.21509L13.5502 4.21709H17.8089C17.8778 4.21709 17.9181 4.29401 17.8798 4.35061L10.0474 15.8549C9.99277 15.9359 9.86539 15.8752 9.89572 15.7801L13.542 4.25955ZM12.8745 3.64396L11.5094 0.0546184C11.4973 0.0222987 11.465 0 11.4286 0H6.51839C6.48199 0 6.45166 0.0222994 6.43756 0.0546184L5.06641 3.64396C5.04412 3.70055 5.08658 3.75926 5.14724 3.75926H12.7955C12.8541 3.75926 12.8966 3.70055 12.8745 3.64396H12.8745ZM8.88658 16.9407L4.89472 4.32545H4.8945C4.87828 4.27083 4.91877 4.21423 4.97731 4.21423H12.9614C13.0179 4.21423 13.0604 4.27083 13.0422 4.32545L9.05035 16.9407C9.02411 17.0196 8.91084 17.0196 8.88658 16.9407Z"
        fill={iconColor}
      />
    </svg>
  );
}

GemIcon.defaultProps = {
  size: 18,
  offset: false,
  color: undefined,
  colorUrl: 'linear--color__gem',
  className: '',
};

GemIcon.propTypes = {
  size: PropTypes.number,
  offset: PropTypes.bool,
  color: PropTypes.string,
  colorUrl: PropTypes.string,
  className: PropTypes.string,
};

export default GemIcon;
