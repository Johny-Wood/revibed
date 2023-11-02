import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import NickName from '@/components/user/NickName';
import type { RootState } from '@/js/redux/reducers';

type PropsFromRedux = ConnectedProps<typeof connector>;

type UserNickNameProps = PropsFromRedux & {
  fontWeight?: string;
  withFlag?: boolean;
  className?: string;
};

function UserNickName({
  fontWeight,
  withFlag = true,
  className,
  userInfo: { name = '', country: { alias = '', title_en: titleEn = '' } = {} } = {},
}: UserNickNameProps) {
  return (
    // @ts-ignore
    <NickName className={className} name={name} alias={alias} withFlag={withFlag} fontWeight={fontWeight} country={titleEn} />
  );
}

const connector = connect((state: RootState) => ({
  userInfo: state.AuthReducer.userInfo,
}));

export default connector(UserNickName);
