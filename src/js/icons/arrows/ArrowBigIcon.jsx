function ArrowBigIcon({ color = 'white' }) {
  return (
    <svg className="icon" width="30" height="56" viewBox="0 0 30 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="2.01628" height="39.9888" transform="matrix(-0.714199 0.699943 -0.714198 -0.699943 30 54.5886)" fill={color} />
      <rect
        width="2.01628"
        height="39.9888"
        transform="matrix(0.714198 0.699943 -0.714199 0.699943 28.5605 -0.00012207)"
        fill={color}
      />
    </svg>
  );
}

export default ArrowBigIcon;
