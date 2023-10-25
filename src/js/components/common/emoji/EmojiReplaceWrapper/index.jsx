import PropTypes from 'prop-types';

import EmojiReplaceWrapperContent from '@/components/common/emoji/EmojiReplaceWrapper/_components/EmojiReplaceWrapperContent';

function EmojiReplaceWrapper({ text }) {
  return <EmojiReplaceWrapperContent text={text} />;
}

EmojiReplaceWrapper.defaultProps = {};

EmojiReplaceWrapper.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EmojiReplaceWrapper;
