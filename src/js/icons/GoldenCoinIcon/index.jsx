import { useMemo } from 'react';

import classNames from 'classnames';

function GoldenCoinIcon({ shadow, colorUrl = 'linear--color__goldenCoin', color, rotate, size = 24, className }) {
  const classNamesEnd = classNames(['icon', 'icon-golden-coin', className]);
  const iconColor = useMemo(() => (color ? `var(--color__${color})` : `url(#${colorUrl})`), [colorUrl, color]);

  if (shadow) {
    return (
      <svg
        style={{
          width: size || 87,
          height: size || 89,
        }}
        className={classNamesEnd}
        width="87"
        height="89"
        viewBox="0 0 87 89"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_16771_178601)">
          <path
            d="M43.5 0C21.8789 0 4 18.3316 4 40.5C4 62.6684 21.8789 81 43.5 81C65.121 81 83 62.6684 83 40.5C83 18.3316 65.121 0 43.5 0ZM43.5 72.9C26.0368 72.9 11.9 58.4053 11.9 40.5C11.9 22.5947 26.0368 8.1 43.5 8.1C60.9632 8.1 75.1 22.5947 75.1 40.5C75.1 58.4053 60.9632 72.9 43.5 72.9Z"
            fill="url(#paint0_linear_16771_178601)"
          />
          <path
            d="M63.4582 20.0369H51.8161L32.274 37.9421V20.0369H24.374V60.9632H32.274V42.2053L52.6477 61.3895H64.7056L41.8372 40.0737L63.4582 20.0369Z"
            fill="url(#paint1_linear_16771_178601)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_16771_178601"
            x="0"
            y="0"
            width="87"
            height="89"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_16771_178601" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_16771_178601" result="shape" />
          </filter>
          <linearGradient id="paint0_linear_16771_178601" x1="43.5" y1="0" x2="43.5" y2="81" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFC46A" />
            <stop offset="1" stopColor="#BD7B0C" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_16771_178601"
            x1="44.5398"
            y1="20.0369"
            x2="44.5398"
            y2="61.3895"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFC46A" />
            <stop offset="1" stopColor="#BD7B0C" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (rotate) {
    return (
      <svg className={classNamesEnd} width="52" height="55" viewBox="0 0 52 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_16771_176307)">
          <path
            d="M26 0C12.3158 0 1 11.3158 1 25C1 38.6842 12.3158 50 26 50C39.6842 50 51 38.6842 51 25C51 11.3158 39.6842 0 26 0ZM26 45C14.9474 45 6 36.0526 6 25C6 13.9474 14.9474 5 26 5C37.0526 5 46 13.9474 46 25C46 36.0526 37.0526 45 26 45Z"
            fill="url(#paint0_linear_16771_176307)"
          />
          <path
            d="M34.8554 9.76385L27.738 11.6343L18.7078 25.4499L15.7911 14.7739L10.9614 16.0431L17.6282 40.4454L22.4578 39.1762L19.4022 27.9918L34.9827 36.1572L42.3542 34.22L24.9014 25.1844L34.8554 9.76385Z"
            fill="url(#paint1_linear_16771_176307)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_16771_176307"
            x="0"
            y="0"
            width="52"
            height="55"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="0.5" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_16771_176307" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_16771_176307" result="shape" />
          </filter>
          <linearGradient id="paint0_linear_16771_176307" x1="26" y1="0" x2="26" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFC46A" />
            <stop offset="1" stopColor="#BD7B0C" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_16771_176307"
            x1="23.2897"
            y1="12.8033"
            x2="29.7859"
            y2="37.5229"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#FFC46A" />
            <stop offset="1" stopColor="#BD7B0C" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      style={{
        width: size,
        height: size,
      }}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNamesEnd}
    >
      <path
        d="M12 0C5.43158 0 0 5.43158 0 12C0 18.5684 5.43158 24 12 24C18.5684 24 24 18.5684 24 12C24 5.43158 18.5684 0 12 0ZM12 21.6C6.69474 21.6 2.4 17.3053 2.4 12C2.4 6.69474 6.69474 2.4 12 2.4C17.3053 2.4 21.6 6.69474 21.6 12C21.6 17.3053 17.3053 21.6 12 21.6Z"
        fill={iconColor}
      />
      <path
        d="M18.0631 5.93689H14.5263L8.58945 11.2422V5.93689H6.18945V18.0632H8.58945V12.5053L14.7789 18.1895H18.4421L11.4947 11.8737L18.0631 5.93689Z"
        fill={iconColor}
      />
    </svg>
  );
}

export default GoldenCoinIcon;
