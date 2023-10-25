import { connect } from 'react-redux';

function Auth({ children, userIsAuthorized }) {
  return userIsAuthorized ? children : null;
}

function NotAuth({ children, userIsAuthorized }) {
  return !userIsAuthorized ? children : null;
}

const UserAuthorized = connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(Auth);

const UserNotAuthorized = connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(NotAuth);

export { UserAuthorized, UserNotAuthorized };
