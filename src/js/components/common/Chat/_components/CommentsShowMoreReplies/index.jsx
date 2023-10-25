import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from './styles.module.scss';

function CommentsShowMoreReplies({ text = 'Show more', onClick = () => {} }) {
  return (
    <Button
      className={classNames(styles.comments__buttonShowMore, 't-size_12 c-blue t-bold')}
      text={text}
      size={ComponentsCommonConstants.Size.SMALL}
      type="button_string"
      onClick={() => {
        onClick();
      }}
    />
  );
}

export default CommentsShowMoreReplies;
