function SpinIcon({ color = 'c-white' }) {
  return (
    <svg
      className="icon icon_spin spin-animation"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.0"
      width="64px"
      height="64px"
      viewBox="0 0 128 128"
      xmlSpace="preserve"
    >
      <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
      <g>
        <path
          d="M17.3 57.6a6.3 6.3 0 1 1-6.28 6.28 6.3 6.3 0 0 1 6.3-6.3zM29 24.04a4.72 4.72 0 1 1-4.7 4.72 4.72 4.72 0 0 1 4.7-4.72zm35.12-22.7A15.72 15.72 0 1 1 48.4 17.06 15.72 15.72 0 0 1 64.12 1.34zm35.1 13.27A14.15 14.15 0 1 1 85.1 28.8a14.15 14.15 0 0 1 14.15-14.15zm11.7 36.7a12.58 12.58 0 1 1-12.57 12.6 12.58 12.58 0 0 1 12.58-12.58zM99.22 88a11 11 0 1 1-11 11 11 11 0 0 1 11-11zm-35.1 13.27a9.44 9.44 0 1 1-9.43 9.44 9.44 9.44 0 0 1 9.4-9.45zM29.02 91.1a7.86 7.86 0 1 1-7.88 7.9A7.86 7.86 0 0 1 29 91.1z"
          className={color}
          fillOpacity="1"
        />
      </g>
    </svg>
  );
}

export default SpinIcon;
