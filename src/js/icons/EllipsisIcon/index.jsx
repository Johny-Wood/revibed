function EllipsisIcon({ color = 'gray-1' }) {
  const colorClass = `var(--color__${color})`;

  return (
    <svg className="icon" width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="1.5" cy="1.5" r="1.5" fill={colorClass} />
      <circle cx="7.5" cy="1.5" r="1.5" fill={colorClass} />
      <circle cx="13.5" cy="1.5" r="1.5" fill={colorClass} />
    </svg>
  );
}

export default EllipsisIcon;
