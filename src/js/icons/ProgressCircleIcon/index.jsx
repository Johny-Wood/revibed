import classNames from 'classnames';

import styles from './styles.module.scss';

function ProgressCircleIcon({ value = 0, strokeWidth = 5, color = 'var(--color__gray-3)' }) {
  return (
    <svg
      className={classNames('progress-circle', styles.progressCircle)}
      viewBox="0 0 106 106"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-17.000000, -17.000000)">
          <circle stroke={color} strokeWidth={strokeWidth} fillRule="nonzero" cx="70" cy="70" r="50" />
          {value > 0 && (
            <path
              className={classNames('progress-circle__path', styles.progressCircle__path)}
              d="M70,120 C97.6142375,120 120,97.6142375 120,70 C120,42.3857625 97.6142375,20 70,20 C42.3857625,20 20,42.3857625 20,70 C20,97.6142375 42.3857625,120 70,120 Z"
              id="Oval-Copy"
              stroke="var(--color__blue)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${(value / 100) * 100 * Math.PI}, 9999`}
              fillRule="nonzero"
              transform="translate(70.000000, 70.000000) rotate(-125.000000) translate(-70.000000, -70.000000) "
            />
          )}
        </g>
      </g>
    </svg>
  );
}

export default ProgressCircleIcon;
