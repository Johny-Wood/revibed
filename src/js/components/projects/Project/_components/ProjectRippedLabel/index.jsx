import classNames from 'classnames';
import PropTypes from 'prop-types';

import LightningIcon from '@/icons/project/state/LightningIcon';

function ProjectRippedLabel({ getRipLinkAllowed, participant }) {
  return (
    <span
      className={classNames(
        'status__label status__label_RIPPED',
        !getRipLinkAllowed && 'disabled',
        !participant && 'not-participant'
      )}
      title="Archived"
    >
      <LightningIcon />
    </span>
  );
}

ProjectRippedLabel.defaultProps = {
  getRipLinkAllowed: false,
  participant: false,
};

ProjectRippedLabel.propTypes = {
  getRipLinkAllowed: PropTypes.bool,
  participant: PropTypes.bool,
};

export default ProjectRippedLabel;
