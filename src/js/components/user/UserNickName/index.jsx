import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NickName from '@/components/user/NickName';

function UserNickName({
  fontWeight,
  withFlag,
  userInfo: { name = '', country: { alias = '', title_en: titleEn = '' } = {} } = {},
  className,
}) {
  return (
    <NickName className={className} name={name} alias={alias} withFlag={withFlag} fontWeight={fontWeight} country={titleEn} />
  );
}

UserNickName.defaultProps = {
  withFlag: true,
};

UserNickName.propTypes = {
  withFlag: PropTypes.bool,
};

export default connect((state) => ({
  userInfo: state.AuthReducer.userInfo,
}))(UserNickName);
