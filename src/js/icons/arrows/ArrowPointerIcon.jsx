import classNames from 'classnames';

function ArrowPointerIcon({ className, style = {}, color = 'var(--color__gray-2)' }) {
  return (
    <svg
      className={classNames('icon', className)}
      style={style}
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.64 0H3.34V7.17464L1.60014 5H0L4.00035 10L8 5H6.40014L4.64 7.20036V0Z"
        fill={color}
      />
    </svg>
  );
}

export default ArrowPointerIcon;
