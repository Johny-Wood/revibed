function PhotoIcon({ error }) {
  return (
    <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 8H20.83L19 6H13L11.17 8H8C6.9 8 6 8.9 6 10V22C6 23.1 6.9 24 8 24H24C25.1 24 26 23.1 26 22V10C26 8.9 25.1 8 24 8ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19ZM11 16C11 18.76 13.24 21 16 21C18.76 21 21 18.76 21 16C21 13.24 18.76 11 16 11C13.24 11 11 13.24 11 16Z"
          fill="white"
        />
      </g>
      <defs>
        <filter id="filter0_d" x="0" y="0" width="32" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feColorMatrix type="matrix" values={`0 0 0 0 ${!error ? 0 : 1} 0 0 0 0 0 0 0 0 0 0 0 0 0 ${!error ? 0.6 : 1} 0`} />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

export default PhotoIcon;
