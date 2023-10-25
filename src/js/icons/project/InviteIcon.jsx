import classNames from 'classnames';

function InviteIcon({ color = 'c-black' }) {
  return (
    <svg width="16" height="18" className={classNames(color)} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.00033 7.82635H0V9.31749H8.00033V7.82635Z" fill="#009444" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0003 7.82635H8V9.31749H16.0003V7.82635Z" fill="#009444" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.68823 0H7.29688V17.8936H8.68823V0Z" fill="#009444" />
    </svg>
  );
}

export default InviteIcon;
