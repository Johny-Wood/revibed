function TimeIcon({ color = 'gray-2' }) {
  return (
    <svg className="icon" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0976562 8C0.0976562 3.58222 3.67988 0 8.09766 0C12.5154 0 16.0977 3.58222 16.0977 8C16.0977 12.4178 12.5154 16 8.09766 16C3.67988 16 0.0976562 12.4178 0.0976562 8ZM7.20703 3.55566H8.54037V8.22233L12.0959 10.329L11.4293 11.4223L7.20703 8.889V3.55566Z"
        fill={`var(--color__${color})`}
      />
    </svg>
  );
}

export default TimeIcon;
