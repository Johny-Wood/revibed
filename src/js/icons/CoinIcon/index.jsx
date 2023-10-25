import { useMemo } from 'react';

function CoinIcon({ className = '', size = 12, color = 'black', colorUrl, type = 'l', offset = true }) {
  const iconColor = useMemo(() => (colorUrl ? `url(#${colorUrl})` : `var(--color__${color})`), [colorUrl, color]);

  switch (type) {
    case 's': {
      return (
        <svg
          style={{
            width: size,
            height: size,
            marginLeft: offset ? `${size / 4.5}px` : 0,
          }}
          className={className}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 0C2.22973 0 0 2.22973 0 5C0 7.77027 2.22973 10 5 10C7.77027 10 10 7.77027 10 5C10 2.22973 7.7027 0 5 0ZM5 9.05405C2.77027 9.05405 0.945946 7.22973 0.945946 5C0.945946 2.77027 2.77027 0.945946 5 0.945946C7.22973 0.945946 9.05405 2.77027 9.05405 5C9.05405 7.22973 7.22973 9.05405 5 9.05405Z"
            fill={iconColor}
          />
          <path
            d="M5.15 4.93243L7.86486 2.5L6.41425 2.50002L3.84668 4.79732V2.5H2.74978V7.56759H3.84668V5.06759L6.54939 7.56759L8 7.56757L5.15 4.93243Z"
            fill={iconColor}
          />
          <defs>
            <linearGradient x1="8.5" y1="0.5" x2="8.5" y2="17.5" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient x1="8.72375" y1="4.70532" x2="8.72375" y2="13.3843" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    case 'm': {
      return (
        <svg
          style={{
            width: size,
            height: size,
            marginLeft: offset ? `${size / 4.5}px` : 0,
          }}
          className={className}
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.5 0C2.89865 0 0 2.89865 0 6.5C0 10.1014 2.89865 13 6.5 13C10.1014 13 13 10.1014 13 6.5C13 2.89865 10.0135 0 6.5 0ZM6.5 11.7703C3.60135 11.7703 1.22973 9.39865 1.22973 6.5C1.22973 3.60135 3.60135 1.22973 6.5 1.22973C9.39865 1.22973 11.7703 3.60135 11.7703 6.5C11.7703 9.39865 9.39865 11.7703 6.5 11.7703Z"
            fill={iconColor}
          />
          <path
            d="M6.6232 6.41216L10.2246 3.25L8.33876 3.25003L5.00092 6.23651V3.33787H3.68335V9.66219H5.00092V6.58787L8.51443 9.83787L10.4002 9.83784L6.6232 6.41216Z"
            fill={iconColor}
          />
          <defs>
            <linearGradient x1="8.5" y1="0.5" x2="8.5" y2="17.5" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient x1="8.72375" y1="4.70532" x2="8.72375" y2="13.3843" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    case 'xl': {
      return (
        <svg
          style={{
            width: size,
            height: size,
            marginLeft: offset ? `${size / 4.5}px` : 0,
          }}
          className={className}
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 0C4.3 0 0 4.3 0 9.5C0 14.7 4.3 19 9.5 19C14.7 19 19 14.7 19 9.5C19 4.3 14.7 0 9.5 0ZM9.5 17.1C5.3 17.1 1.9 13.7 1.9 9.5C1.9 5.3 5.3 1.9 9.5 1.9C13.7 1.9 17.1 5.3 17.1 9.5C17.1 13.7 13.7 17.1 9.5 17.1Z"
            fill={iconColor}
          />
          <path
            d="M14.3 4.69995H11.5L6.80002 8.89995V4.69995H4.90002V14.3H6.80002V9.89995L11.7 14.4H14.6L9.10002 9.39995L14.3 4.69995Z"
            fill={iconColor}
          />
          <defs>
            <linearGradient x1="8.5" y1="0.5" x2="8.5" y2="17.5" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
            <linearGradient x1="8.72375" y1="4.70532" x2="8.72375" y2="13.3843" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
    case 'l':
    default: {
      return (
        <svg
          style={{
            width: size,
            height: size,
            marginLeft: offset ? `${size / 5.5}px` : 0,
          }}
          className={className}
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8.5" cy="8.5" r="7.75" stroke={iconColor} strokeWidth="1.5" />
          <line x1="5.28333" y1="4.25" x2="5.28332" y2="12.75" stroke={iconColor} strokeWidth="1.5" />

          <path
            d="M10.4888 4.56873L6.3717 8.25427H7.46961L11.5868 4.56873H10.4888Z"
            fill={iconColor}
            stroke={iconColor}
            strokeWidth=".7"
          />
          <path
            d="M10.6732 12.5375L6.3717 8.5531H7.51877L11.8203 12.5375H10.6732Z"
            fill={iconColor}
            stroke={iconColor}
            strokeWidth=".7"
          />
          <defs>
            <linearGradient x1="8.72375" y1="4.70532" x2="8.72375" y2="13.3843" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#D3B13A" />
              <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
            </linearGradient>
          </defs>
        </svg>
      );
    }
  }
}

export default CoinIcon;
