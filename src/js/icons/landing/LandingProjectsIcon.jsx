function LandingProjectsIcon({ color = '#F2F2F2' }) {
  return (
    <svg className="icon" width="31" height="34" viewBox="0 0 31 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.3478 33.4999C22.2719 33.4999 28.6957 27.0761 28.6957 19.152C28.6957 11.2279 22.2719 4.8042 14.3478 4.8042C6.42374 4.8042 0 11.2279 0 19.152C0 27.0761 6.42374 33.4999 14.3478 33.4999ZM14.3479 23.4564C16.7251 23.4564 18.6522 21.5293 18.6522 19.152C18.6522 16.7748 16.7251 14.8477 14.3479 14.8477C11.9706 14.8477 10.0435 16.7748 10.0435 19.152C10.0435 21.5293 11.9706 23.4564 14.3479 23.4564Z"
        fill={color}
      />
      <circle cx="27.2607" cy="3.36957" r="2.86957" fill={color} />
    </svg>
  );
}

export default LandingProjectsIcon;
