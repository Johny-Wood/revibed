function LightningIcon({ color = 'white' }) {
  return (
    <svg className="icon" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.02605 14.0005C2.02605 14.0005 15.947 5.25636 15.9997 5.25636C16.0524 5.25636 7.94713 5.30226 7.94713 5.30226L13.9998 0.000549316H6.02628L0 7.0005H6.02628L2.02634 14.0004L2.02605 14.0005Z"
        fill={`var(--color__${color})`}
      />
    </svg>
  );
}

export default LightningIcon;
