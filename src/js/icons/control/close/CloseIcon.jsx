function CloseIcon({ color = '#1A1A1A', isSmall = false }) {
  if (!isSmall) {
    return (
      <svg className="icon icon-close" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8.4L1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4Z" fill={color} />
      </svg>
    );
  }

  return (
    <svg className="icon icon-close" width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8.57715" y="7.82837" width="2" height="10" transform="rotate(135 8.57715 7.82837)" fill={color} />
      <rect x="1.50586" y="9.24268" width="2" height="10" transform="rotate(-135 1.50586 9.24268)" fill={color} />
    </svg>
  );
}

export default CloseIcon;
