function NotificationsIcon({ color = '#1A1A1A' }) {
  return (
    <svg
      className="icon notification-icon"
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.83193 13.1175V7.68014C1.83193 3.72404 5.18921 0.50238 9.33062 0.50238H10.6694C14.8228 0.50238 18.1681 3.71114 18.1681 7.66931C18.1681 7.66931 18.1681 8.96421 18.1681 13.1175C18.997 13.8367 19.5294 14.9363 19.5294 16.163H16.7948H3.20524H0.470581C0.470581 14.9363 1.00299 13.8367 1.83193 13.1175ZM5.91596 17.468L7.29392 18.8822C7.29392 18.8822 9.09331 20.0781 10.0056 20.0781C10.8614 20.0781 12.7486 18.7974 12.7486 18.7974L14.084 17.468H5.91596Z"
        fill={color}
      />
    </svg>
  );
}

export default NotificationsIcon;
