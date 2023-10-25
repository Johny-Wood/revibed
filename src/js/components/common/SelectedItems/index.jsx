import classNames from 'classnames';

import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';

import styles from './styles.module.scss';

function SelectedItems({ count, className }) {
  return (
    <TransitionLayout isShown={!!count}>
      <span className={classNames(styles.selectedCount, className)}>
        <span className="c-gray-2">Selected:&nbsp;</span>
        <span>{count}</span>
      </span>
    </TransitionLayout>
  );
}

export default SelectedItems;
