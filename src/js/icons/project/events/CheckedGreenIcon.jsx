function CheckedGreenIcon({ color = '#6FCF97' }) {
  return (
    <svg className="icon icon-event" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="8" cy="7.95429" rx="8" ry="7.95429" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.01795 10.7567L4.21094 8.00447L5.33374 6.90358L7.01795 8.55491L11.5092 4.15137L12.632 5.25225L7.01795 10.7567Z"
        fill="white"
      />
    </svg>
  );
}

export default CheckedGreenIcon;
