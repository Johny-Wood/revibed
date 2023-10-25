import classNames from 'classnames';
import PropTypes from 'prop-types';

import EmojiReplaceWrapper from '@/components/common/emoji/EmojiReplaceWrapper';

import styles from './styles.module.scss';

function DialogMessageReply({ className, name, text, deleted }) {
  return (
    <div className={classNames(styles.dialogNewMessageReply, className)}>
      <div className={styles.dialogNewMessageReply__name}>{deleted ? <b>deleted message</b> : name}</div>
      {!deleted && (
        <p title={text} className="t-ellipsis">
          {text ? <EmojiReplaceWrapper text={text} /> : <b>attachment</b>}
        </p>
      )}
    </div>
  );
}

DialogMessageReply.defaultProps = {
  name: '',
  text: '',
  deleted: false,
};

DialogMessageReply.propTypes = {
  name: PropTypes.string,
  text: PropTypes.string,
  deleted: PropTypes.bool,
};

export default DialogMessageReply;
