import { useMemo } from 'react';

function BuyCutIcon({ colorUrl, color = 'black' }) {
  const iconColor = useMemo(() => (colorUrl ? `url(#${colorUrl})` : `var(--color__${color})`), [colorUrl, color]);

  return (
    <svg
      className="icon icon_color_black"
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M12.1919 10.5H0.183594V12.5H12.1919V10.5Z" fill={iconColor} />
      <path fillRule="evenodd" clipRule="evenodd" d="M24.1997 10.5H12.1914V12.5H24.1997V10.5Z" fill={iconColor} />
      <path fillRule="evenodd" clipRule="evenodd" d="M13.2329 0H11.1445V24H13.2329V0Z" fill={iconColor} />
    </svg>
  );
}

export default BuyCutIcon;
