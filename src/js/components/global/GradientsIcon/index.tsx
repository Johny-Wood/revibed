import styles from './styles.module.scss';

function GradientsIcon() {
  return (
    <svg className={styles.gradientIcon} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gem-gradient" x1="8.5" y1="0.5" x2="8.5" y2="17.5" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D3B13A" />
          <stop offset="1" stopColor="#EE6F46" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient
          id="linear--color__event-bonus"
          x1="8.94731"
          y1="0"
          x2="8.94731"
          y2="16.9999"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFCEA0" />
          <stop offset="1" stopColor="#F07216" />
        </linearGradient>
        <linearGradient id="linear--color__event-coin" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.75" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="linear--color__goldenCoin"
          x1="8.94731"
          y1="0"
          x2="8.94731"
          y2="16.9999"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FFC46A" />
          <stop offset="1" stopColor="#BD7B0C" />
        </linearGradient>
        <linearGradient id="linear--color__gem" x1="8.94731" y1="0" x2="8.94731" y2="16.9999" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D3B13A" />
          <stop offset="1" stopColor="rgba(238, 111, 70, 0.88)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default GradientsIcon;
