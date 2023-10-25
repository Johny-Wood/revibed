function TelegramLogo({ className = '' }) {
  return (
    <svg className={className} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clipTelegramLogo1)">
        <path
          d="M17.5 34.9999C27.165 34.9999 35 27.1649 35 17.4999C35 7.83489 27.165 -0.00012207 17.5 -0.00012207C7.83502 -0.00012207 0 7.83489 0 17.4999C0 27.1649 7.83502 34.9999 17.5 34.9999Z"
          fill="url(#idTelegramLogo1)"
        />
        <path
          d="M14.2917 25.5207C13.7247 25.5207 13.8211 25.3066 13.6255 24.7667L11.9583 19.2801L24.7917 11.6665"
          fill="#C8DAEA"
        />
        <path d="M14.2917 25.5207C14.7292 25.5207 14.9224 25.3206 15.1667 25.0832L17.5 22.8143L14.5895 21.0592" fill="#A9C9DD" />
        <path
          d="M14.5892 21.0597L21.6417 26.2702C22.4465 26.7142 23.0272 26.4842 23.2277 25.523L26.0985 11.9951C26.3923 10.8168 25.6493 10.2821 24.8793 10.6317L8.02244 17.1316C6.87181 17.5932 6.87867 18.2352 7.81273 18.5211L12.1386 19.8714L22.1534 13.5532C22.6262 13.2665 23.0602 13.4205 22.7041 13.7366"
          fill="url(#idTelegramLogo2)"
        />
      </g>
      <defs>
        <linearGradient id="idTelegramLogo1" x1="23.345" y1="5.84488" x2="14.595" y2="26.2499" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#37AEE2" />
          <stop offset="1" stopColor="#1E96C8" />
        </linearGradient>
        <linearGradient id="idTelegramLogo2" x1="19.6939" y1="17.5013" x2="22.425" y2="23.7238" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#EFF7FC" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <clipPath id="clipTelegramLogo1">
          <rect width="35" height="35" fill="white" transform="translate(0 -0.00012207)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default TelegramLogo;
