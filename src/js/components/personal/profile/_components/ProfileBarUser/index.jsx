import classNames from 'classnames';

import EditFieldsButton from '@/components/forms/personal/profile/_components/EditFieldsButton';
import ProjectParticipationInfo from '@/components/personal/profile/_components/ProfileBarUser/_components/ProjectParticipationInfo';
import NickName from '@/components/user/NickName';
import UserAvatar from '@/components/user/UserAvatar';
import { PersonalEditModulesConstants } from '@/constants/personal/edit/module';

import styles from './styles.module.scss';

function ProfileBarUser({ userInfo, isMy, children }) {
  return (
    <div className={styles.profileBarUser}>
      <div className={styles.profileBarUser__avatar}>
        <UserAvatar className={styles.userAvatar} userData={userInfo} size={120} />
        {isMy && (
          <EditFieldsButton
            className={classNames(styles.editFieldsButton, 'm-left-10')}
            moduleName={PersonalEditModulesConstants.AVATAR}
          />
        )}
      </div>
      <div className={styles.profileBarUser__info}>
        <div className={styles.profileBarUser__name}>
          <NickName className={styles.nickname} classNameNickName={styles.nickname__name} userData={userInfo} fontWeight="bold" />
          {isMy && <EditFieldsButton className="m-left-10" moduleName={PersonalEditModulesConstants.NAME} />}
        </div>
        <ProjectParticipationInfo userInfo={userInfo} />
      </div>
      {children}
    </div>
  );
}

export default ProfileBarUser;
