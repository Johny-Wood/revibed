function DownloadFileIcon({ color = '#1A1A1A' }) {
  return (
    <svg className="icon" width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.11021 0.630341H3.86943V7.4782L2.20877 5.40256H0.68153L4.49964 10.1748L8.31709 5.40256H6.79011L5.11021 7.50262V0.630341Z"
        fill={color}
      />
      <rect x="8.795" y="11.1292" width="1.24078" height="8.59" transform="rotate(90 8.795 11.1292)" fill={color} />
    </svg>
  );
}

export default DownloadFileIcon;
