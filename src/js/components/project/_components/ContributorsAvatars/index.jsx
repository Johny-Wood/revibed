import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Contributor from '@/components/project/_components/Contributor';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ComponentsCommonConstants from '@/constants/components/common';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import EllipsisIcon from '@/icons/EllipsisIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ContributorsAvatars({
  contributors,
  className,

  showPopup,
}) {
  if (contributors.length === 0) {
    return null;
  }

  const contributorsList = contributors.slice(0, 4);

  return (
    <div className={classNames(styles.contributorsAvatars, className)}>
      <div className={styles.contributorsAvatars__title}>
        <b>{contributors.length}</b> <span className="c-gray-2">wanted</span>
      </div>
      <div className={styles.contributorsAvatars__list}>
        {contributorsList.map((contributor, idx) => {
          const { id: contributorId } = contributor;

          return (
            <Contributor
              userAvatarClassName={styles.userAvatar}
              className={styles.contributor}
              key={`contributors-avatars-contributor-${contributorId}`}
              weight={contributorsList.length - idx}
              contributor={contributor}
              withDescriptionRole={false}
              avatar={{
                size: 26,
              }}
              withInfo={false}
            />
          );
        })}
        {contributors.length > 4 && (
          <ButtonIcon
            className={styles.buttonShowContributors}
            icon={EllipsisIcon}
            iconColor="black"
            color="gray-4"
            rounded
            size={ComponentsCommonConstants.Size.SMALL}
            onClick={() => {
              showPopup(PopupProjectIdsConstants.ContributorsPopup, {
                contributors,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

ContributorsAvatars.defaultProps = {
  contributors: [],
};

ContributorsAvatars.propTypes = {
  contributors: PropTypes.array,
};

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ContributorsAvatars);
