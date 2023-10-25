import classNames from 'classnames';
import PropTypes from 'prop-types';

import FollowButtons from '@/components/follow/FollowButtons';
import NickName from '@/components/user/NickName';
import UserAvatar from '@/components/user/UserAvatar';
import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function ProjectContributorInfo({
  boughtType = ['cut', 'cuts'],
  boughtShownCount = true,
  boughtDescription = 'bought',
  withFollow,
  withDescription,
  withDescriptionRole,
  role,
  isRoute,
  contributor: {
    id: userId,
    isMe,
    name,
    subscription,
    subscriber,
    type,
    avatar,
    contributed,
    country: { alias, title_en: titleEn } = {},
    subscribersCount,
  } = {},
  avatar: {
    size: avatarSize = 50,
    kollektivxAvatar,
    isSystemGoldenCoin,
    isSystemGem,
    backgroundColor: avatarBackgroundColor,
  } = {},
  withInfoDetails,
  withBought,
  contributorDescription,
  bought,
  withInfo,
  onClick = () => {},
  className,
  nameClassName,
  boughtClassName,
  contributorDescriptionClassName,
  paramsClassName,
  userAvatarClassName,
  classNameNickName,
  nickClassName,
  flagClassName,
  withFollowers,
  roleInfoCountsClassName,
  followButtonsSize,
  followButtonsClassName,
}) {
  return (
    <div className={classNames(styles.projectRoleInfo, className)}>
      <UserAvatar
        className={userAvatarClassName}
        size={avatarSize}
        src={avatar}
        userId={userId}
        isRoute={isRoute}
        onClick={onClick}
        isSystemGoldenCoin={isSystemGoldenCoin}
        isSystemGem={isSystemGem}
        kollektivxAvatar={kollektivxAvatar}
        backgroundColor={avatarBackgroundColor}
      />
      {withInfo && (
        <>
          <div className={classNames(styles.projectRoleInfo__params, paramsClassName)}>
            <NickName
              className={classNames(
                styles.projectRoleInfo__name,
                type === 'system' && styles.nickname_system,
                nameClassName,
                nickClassName
              )}
              classNameNickName={classNames([type === 'system' && styles.nickname__name_system, classNameNickName])}
              flagClassName={flagClassName}
              withDescription={withDescription}
              fontWeight="bold"
              alias={alias}
              country={titleEn}
              name={name}
              withDescriptionRole={withDescriptionRole}
              role={role}
              userId={userId}
              isRoute={isRoute}
              onClick={onClick}
            />
            <div>
              {((withInfoDetails && contributed >= 0) || withBought || contributorDescription) && (
                <div className={classNames([styles.projectRoleInfo__name, nameClassName, 'text_size_12'])}>
                  <div className={styles.projectRoleInfoCounts}>
                    {withInfoDetails && contributed >= 0 && (
                      <div className={classNames(styles.projectRoleInfoCounts__count, roleInfoCountsClassName)}>
                        <span className={classNames([styles.projectRoleInfo__description, 'c-gray-2'])}>pre-orders:&nbsp;</span>
                        <span>{contributed}</span>
                      </div>
                    )}
                    {withFollowers && subscribersCount >= 0 && (
                      <div className={classNames(styles.projectRoleInfoCounts__count, roleInfoCountsClassName)}>
                        <span className={classNames([styles.projectRoleInfo__description, 'c-gray-2'])}>followers:&nbsp;</span>
                        <span>{subscribersCount}</span>
                      </div>
                    )}
                  </div>
                  {withBought && (
                    <div className={classNames([styles.projectRoleInfo__bought, boughtClassName])}>
                      {boughtDescription}
                      <b>
                        {boughtShownCount && ` ${bought}`} {textForLotsOfUtil(bought, boughtType)}
                      </b>
                    </div>
                  )}
                  {!!contributorDescription && (
                    <div
                      className={classNames([styles.projectRoleInfo__contributorDescription, contributorDescriptionClassName])}
                    >
                      {contributorDescription}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {withFollow && type !== 'system' && (
            <FollowButtons
              className={followButtonsClassName}
              size={followButtonsSize}
              id={userId}
              isMe={isMe}
              subscription={subscription}
              subscriber={subscriber}
            />
          )}
        </>
      )}
    </div>
  );
}

ProjectContributorInfo.defaultProps = {
  contributor: {},
  avatar: {},
  withDescription: true,
  withDescriptionRole: false,
  withInfoDetails: true,
  withBought: false,
  contributorDescription: '',
  withInfo: true,
  bought: 0,
  role: 'contributor',
};

ProjectContributorInfo.propTypes = {
  contributor: PropTypes.object,
  avatar: PropTypes.object,
  withDescription: PropTypes.bool,
  withDescriptionRole: PropTypes.bool,
  withInfoDetails: PropTypes.bool,
  withBought: PropTypes.bool,
  contributorDescription: PropTypes.string,
  withInfo: PropTypes.bool,
  bought: PropTypes.number,
  role: PropTypes.string,
};

export default ProjectContributorInfo;
