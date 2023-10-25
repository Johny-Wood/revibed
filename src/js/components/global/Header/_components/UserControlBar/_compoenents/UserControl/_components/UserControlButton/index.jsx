import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import MyAvatar from '@/components/user/MyAvatar';
import UserBalance from '@/components/user/UserBalance';
import UserNickName from '@/components/user/UserNickName';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

function UserControlButton({ shownContent, onClick }) {
  return (
    <Button className={styles.userControlDropDown} type="button_string" onClick={onClick}>
      <MobileLayout>
        <MyAvatar className={styles.userAvatar} />
      </MobileLayout>
      <DesktopLayout>
        <LinkRoute
          href={RoutePathsConstants.MY_PROJECTS}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MyAvatar className={styles.userAvatar} />
        </LinkRoute>
        <div className={styles.controlInfo}>
          <div className={styles.controlInfo__name}>
            <LinkRoute
              href={RoutePathsConstants.MY_PROJECTS}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <UserNickName className={styles.nickname} withFlag={false} />
            </LinkRoute>
          </div>
          <UserBalance textSize={14} />
        </div>
        <span className="i-arrow">
          <ArrowIcon isOpened={shownContent} size={ComponentsCommonConstants.Size.NORMAL} />
        </span>
      </DesktopLayout>
    </Button>
  );
}

export default UserControlButton;
