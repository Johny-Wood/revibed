import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UserAvatar from '@/components/user/UserAvatar';

function MyAvatar({ size, rounded, deleted, userInfo: { avatar } = {}, className }) {
  return <UserAvatar size={size} rounded={rounded} deleted={deleted} src={avatar} className={className} />;
}

MyAvatar.defaultProps = {
  size: 30,
  rounded: true,
  className: '',
};

MyAvatar.propTypes = {
  size: PropTypes.number,
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(MyAvatar);
