import type { PropsWithChildren } from 'react';

import { connect } from 'react-redux';

import type { RootState } from '@/js/redux/reducers';

type AuthProps = PropsWithChildren & {
  userIsAuthorized: boolean;
};

function Auth({ children, userIsAuthorized }: AuthProps) {
  return userIsAuthorized ? children : null;
}

function NotAuth({ children, userIsAuthorized }: AuthProps) {
  return !userIsAuthorized ? children : null;
}

const UserAuthorized = connect((state: RootState) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(Auth);

const UserNotAuthorized = connect((state: RootState) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(NotAuth);

export { UserAuthorized, UserNotAuthorized };
