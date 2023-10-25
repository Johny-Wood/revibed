import classNames from 'classnames';

import TranslateText from '@/components/common/TranslateText';

import styles from './styles.module.scss';

function RipperCabinetStatus({ status, className }) {
  return (
    <span className={classNames(className, styles.ripperStatus)}>
      <span className="text t-medium">
        <TranslateText translateKey={status} />
      </span>
    </span>
  );
}

export default RipperCabinetStatus;
