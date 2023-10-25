import { connect } from 'react-redux';

import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { signOutRequestAction } from '@/redux-actions/auth/authActions';

function LogoutButton({ size = ComponentsCommonConstants.Size.SMALL40, signOut = () => {} }) {
  return (
    <Button text="Log out" borderColor="gray-4" transparent className="button_logout" size={size} onClick={() => signOut()} />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    signOut: (params = {}) => signOutRequestAction(params)(dispatch),
  })
)(LogoutButton);
