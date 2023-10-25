import { connect } from 'react-redux';

import popupAnimation from '@/assets/styles/animations/popup.module.scss';
import ProjectTag from '@/components/projects/Project/_components/ProjectTag';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import SmallPlusIcon from '@/icons/SmallPlusIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';

import styles from './styles.module.scss';

function ProfileBarFavoriteStyles({ userInfo: { favoriteStyles = [] } = {}, isMy, showPopup }) {
  const { isNotDesktop, isTablet } = ViewportHook();

  return (
    <div className={styles.profileBarFavoriteStyles}>
      {(favoriteStyles.length > 0 || isMy) && (
        <div className={styles.profileBarFavoriteStyles__content}>
          {favoriteStyles.map(({ id, type, name }) => (
            <ProjectTag nameClassName={styles.projectTag__name} key={`favorite-styles-${id}-${type}`} tag={{ id, name }} />
          ))}
          {isMy && (
            <ButtonIcon
              type="button_string"
              className={styles.profileBarFavoriteStyles__edit}
              icon={SmallPlusIcon}
              onClick={() => {
                showPopup(PopupPersonalIdsConstants.FavoriteStylesPopup, {
                  animationClassNames:
                    isNotDesktop && !isTablet
                      ? {
                          enter: popupAnimation.onlyPopupAnimationEnter,
                          enterActive: popupAnimation.onlyPopupAnimationEnter_active,
                          exit: popupAnimation.onlyPopupAnimationExit,
                          exitActive: popupAnimation.onlyPopupAnimationExit_active,
                        }
                      : undefined,
                });
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ProfileBarFavoriteStyles);
