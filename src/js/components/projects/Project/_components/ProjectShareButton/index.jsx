import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ShareButton from '@/components/share/ShareButton';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

function ProjectShareButton({
  status: { name: statusName } = {},
  withText,
  href,
  path,
  className,

  variablesList: { HOST = '' } = {},
}) {
  const { asPath = '' } = useRouter();

  if (
    !projectsStatusesUtil.isLastCallStatus(statusName) &&
    !projectsStatusesUtil.isOpenStatus(statusName) &&
    !projectsStatusesUtil.isLegacyStatus(statusName)
  ) {
    return null;
  }

  return <ShareButton className={className} href={href || `${HOST}${path || asPath}`} withText={withText} />;
}

ProjectShareButton.defaultProps = {
  status: {},
  withText: true,
  href: '',
  path: '',
};

ProjectShareButton.propTypes = {
  status: PropTypes.object,
  withText: PropTypes.bool,
  href: PropTypes.string,
  path: PropTypes.string,
};

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(ProjectShareButton);
