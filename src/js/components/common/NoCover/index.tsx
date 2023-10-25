import classNames from 'classnames';

import NoCoverIcon from '@/icons/project/NoCoverIcon';

import styles from './styles.module.scss';

type NoCoverProps = {
  withOutCircle?: boolean;
  className?: string;
};

function NoCover({ withOutCircle, className }: NoCoverProps) {
  return (
    <div className={classNames(styles.noCover, className)}>
      <div className={classNames(styles.noCover__circle, withOutCircle && styles.noCover__circle_hidden)}>
        <NoCoverIcon />
      </div>
    </div>
  );
}

export default NoCover;
