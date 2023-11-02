import classNames from 'classnames';

import TopUpBalanceButton from '@/components/common-ui/buttons/TopUpBalanceButton';
import PersonalNavigationList from '@/components/global/Header/_components/PersonalNavigationList';
import LinkRoute from '@/components/ui/links/LinkRoute';
import MyAvatar from '@/components/user/MyAvatar';
import UserBalance from '@/components/user/UserBalance';
import UserNickName from '@/components/user/UserNickName';
import { PersonalUserControlNavigationConstants } from '@/constants/navigations/personal';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function UserControlContent() {
  return (
    <div className={styles.userControlList}>
      <div className={styles.userControlList__list}>
        <div className={styles.userControlList__info}>
          <div className="f-y-center">
            <LinkRoute
              href={RoutePathsConstants.MY_PROJECTS}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MyAvatar size={40} />
            </LinkRoute>
            <div>
              <LinkRoute
                href={RoutePathsConstants.MY_PROJECTS}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <UserNickName withFlag={false} />
              </LinkRoute>
              <UserBalance textSize={14} />
            </div>
          </div>
          <TopUpBalanceButton
            text="Top Up"
            transparent={false}
            className={classNames(styles.topUpBalanceButton, 'border-gray-4')}
            size="small"
          />
        </div>
        {/* @ts-ignore */}
        <PersonalNavigationList
          id="personalControlNavigation"
          navigationList={PersonalUserControlNavigationConstants}
          itemClassName={styles.navigationItem}
        />
      </div>
    </div>
  );
}

export default UserControlContent;
