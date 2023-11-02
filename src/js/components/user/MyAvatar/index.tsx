import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import UserAvatar from '@/components/user/UserAvatar';
import type { RootState } from '@/js/redux/reducers';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MyAvatarProps = PropsFromRedux & {
  size?: number;
  rounded?: boolean;
  deleted?: boolean;
  className?: string;
};

function MyAvatar({ size = 30, rounded = true, deleted, className, userInfo: { avatar } = {} }: MyAvatarProps) {
  return <UserAvatar size={size} rounded={rounded} deleted={deleted} src={avatar} className={className} />;
}

const connector = connect((state: RootState) => ({
  userInfo: state.AuthReducer.userInfo,
}));

export default connector(MyAvatar);
