import { useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import ProjectRippedLabel from '@/components/projects/Project/_components/ProjectRippedLabel';
import {
  ProjectStatusDefaultProps,
  ProjectStatusPropTypes,
} from '@/components/projects/Project/_components/ProjectStatus/_config/props';
import SecuredLabel from '@/components/projects/Project/_components/SecuredLabel';
import Button from '@/components/ui/buttons/Button';
import { ProjectStatusesConstants } from '@/constants/projects/status';
import TranslateHook from '@/hooks/translate/TranslateHook';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

function ProjectStatusContent({
  changeFilterCallBack,
  filters: filtersItems = {},

  projectInfo,
  projectInfo: {
    status: { name, projectRipped, getRipLinkAllowed } = {},
    lateEntryStatus: { name: lateEntryName, projectRipped: lateEntryProjectRipped } = {},
    requestedUserInfo: { contributor: { participation: participationContributor } = {} } = {},
    secured,
  } = {},

  withFilter,
  disabled,
  className,
  tooltip,
  title,

  onMouseEnter,
  onMouseLeave,

  userIsAuthorized,
}) {
  const t = TranslateHook();

  const canBeLateEntryStatus = useMemo(
    () =>
      projectsStatusesUtil.canBeLateEntryStatus(projectInfo, {
        userIsAuthorized,
      }),
    [userIsAuthorized, projectInfo]
  );

  const statusName = useMemo(() => (canBeLateEntryStatus ? lateEntryName : name), [canBeLateEntryStatus, lateEntryName, name]);
  const projectRippedEnd = useMemo(
    () => (canBeLateEntryStatus ? lateEntryProjectRipped : projectRipped),
    [canBeLateEntryStatus, lateEntryProjectRipped, projectRipped]
  );
  const getRipLinkAllowedEnd = useMemo(
    () => canBeLateEntryStatus || getRipLinkAllowed,
    [canBeLateEntryStatus, getRipLinkAllowed]
  );

  return (
    <span className="statuses">
      {canBeLateEntryStatus && projectsStatusesUtil.isComingSoonStatus(lateEntryName) && (
        <ProjectStatusContent
          projectInfo={{
            status: { name: ProjectStatusesConstants.LATE_ENTRY },
          }}
          disabled
          t={t}
        />
      )}
      <span
        className={classNames('project-status', className, disabled && 'disabled')}
        onMouseOverCapture={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Button
          type="button_string"
          className={classNames(
            'status',
            withFilter && !disabled ? 'status_with_filter' : 'status_without_filter',
            `status_${statusName}`
          )}
          onClick={() => {
            if (!withFilter || disabled) {
              return;
            }

            changeFilterCallBack({
              categoryId: 'STATUS',
              items: [filtersItems.find(({ queryParam } = {}) => queryParam === statusName)],
              isNowSending: true,
              isApplyFilter: true,
              beforeResetCategory: true,
            });
          }}
          disabled={disabled}
          tooltip={tooltip}
          title={title}
        >
          <span className="status__name">{t(statusName)}</span>
        </Button>
        {projectRippedEnd && (
          <ProjectRippedLabel getRipLinkAllowed={getRipLinkAllowedEnd} participant={participationContributor} />
        )}
        {secured && (projectsStatusesUtil.isOpenStatus(statusName) || projectsStatusesUtil.isLastCallStatus(statusName)) && (
          <SecuredLabel />
        )}
      </span>
    </span>
  );
}

ProjectStatusContent.defaultProps = {
  ...ProjectStatusDefaultProps,
};

ProjectStatusContent.propTypes = {
  ...ProjectStatusPropTypes,
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(ProjectStatusContent);
