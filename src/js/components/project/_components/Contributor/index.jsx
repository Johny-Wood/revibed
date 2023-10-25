import classNames from 'classnames';

import ProjectContributorInfo from '@/components/projects/Project/_components/ProjectContributorInfo';

import styles from './styles.module.scss';

function Contributor({
  withDescriptionRole = true,
  isRoute,
  withInfoDetails,
  withBought,
  bought,
  withInfo,
  weight,
  contributor = {},
  contributor: { isFounder, type } = {},
  avatar,
  onClick = () => {},
  className,
  projectRoleInfoClassName,
  nameClassName,
  classNameNickName,
  nickClassName,
  withFollow,
  withFollowers,
}) {
  return (
    <div
      className={classNames([styles.contributor, className, type === 'system' && styles.contributor_system])}
      style={{
        zIndex: weight,
      }}
    >
      <ProjectContributorInfo
        className={projectRoleInfoClassName}
        nameClassName={nameClassName}
        classNameNickName={classNameNickName}
        nickClassName={nickClassName}
        contributor={contributor}
        withDescription={false}
        withDescriptionRole={withDescriptionRole}
        avatar={avatar}
        isRoute={isRoute}
        role={isFounder ? 'founder' : ''}
        withInfoDetails={withInfoDetails}
        withBought={withBought}
        bought={bought}
        withInfo={withInfo}
        onClick={onClick}
        withFollow={withFollow}
        withFollowers={withFollowers}
      />
    </div>
  );
}

export default Contributor;
