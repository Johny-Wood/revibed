import classNames from 'classnames';

import RedirectComponent from '@/components/common/RedirectComponent';
import Button from '@/components/ui/buttons/Button';
import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';

import styles from './styles.module.scss';

const href = RoutePathsConstants.WANTLIST_ADD;

function LandingJoinButton({ fixed }) {
  const { router = {} } = NextRouter.getInstance();

  return (
    <div className={classNames([styles.landingJoinNow, fixed && styles.landingJoinNow_fixed])}>
      <RedirectComponent routeBefore={href} redirectUri={RoutePathsConstants.SIGN_UP}>
        <Button
          onClick={() => {
            router.push({ pathname: href });
          }}
          type="button"
          className="landing-join-now-button"
          text="Start digging now"
          rounded
        />
      </RedirectComponent>
    </div>
  );
}

export default LandingJoinButton;
