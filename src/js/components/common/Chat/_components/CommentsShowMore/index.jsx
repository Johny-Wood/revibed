import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from './styles.module.scss';

function CommentsShowMore({ text = 'Show more', onClick = () => {}, inProcess }) {
  return (
    <Button
      className={classNames(styles.comments__buttonShowMore, 't-bold m-top-15')}
      text={text}
      size={ComponentsCommonConstants.Size.SMALL}
      color="gray-4"
      isInProcess={inProcess}
      onClick={() => {
        onClick();
      }}
    />
  );
}

export default CommentsShowMore;
