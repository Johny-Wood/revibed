import { useMemo } from 'react';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProjectActionButton from '@/components/projects/Project/_components/buttons/ProjectActionButton';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';

function CreateProjectLink({
  pathname = RoutePathsConstants.DRAFTS_ADD,
  query,
  routeBefore = pathname,
  text,
  transparent,
  rounded,
  redirectEnabled,
  withIcon,
  gtmAttribute,

  onClick,

  userInfo: { createProjectsDisabled, gemsCount = 0, goldenCoinsCount = 0 } = {},
  variablesList: { CREATE_PROJECT_USE_GEM_ALLOWED, CREATE_PROJECT_USE_GOLDEN_COIN_ALLOWED } = {},
  showPopup,
}) {
  const { pathname: currentPathname } = useRouter();

  const isUseGem = useMemo(() => gemsCount > 0 && CREATE_PROJECT_USE_GEM_ALLOWED, [CREATE_PROJECT_USE_GEM_ALLOWED, gemsCount]);

  const isUseGoldenCoin = useMemo(
    () => goldenCoinsCount > 0 && CREATE_PROJECT_USE_GOLDEN_COIN_ALLOWED,
    [CREATE_PROJECT_USE_GOLDEN_COIN_ALLOWED, goldenCoinsCount]
  );

  return (
    <ProjectActionButton
      withIcon={withIcon}
      isActive={currentPathname === pathname}
      text={text}
      title={text}
      transparent={transparent}
      rounded={rounded}
      className="button-start-project"
      isUseGoldenCoin={isUseGoldenCoin}
      isUseGem={isUseGem}
      gtmAttribute={gtmAttribute}
      redirectEnabled={redirectEnabled}
      routeBefore={routeBefore}
      query={query}
      type="START_PROJECT"
      onClick={(e) => {
        if (e) {
          e.preventDefault();
        }

        if (createProjectsDisabled) {
          showPopup(PopupProjectIdsConstants.CreateProjectsDisabledPopup);
        } else {
          const { router = {} } = NextRouter.getInstance();

          router.push({ pathname, query }).then(() => onClick());
        }
      }}
    />
  );
}

CreateProjectLink.defaultProps = {
  pathname: undefined,
  query: {},
  text: `Start ${CommonMessagesConstants.PREORDER}`,
  transparent: true,
  rounded: true,
  redirectEnabled: true,
  onClick: () => {},
};

CreateProjectLink.propTypes = {
  pathname: PropTypes.string,
  query: PropTypes.object,
  text: PropTypes.string,
  transparent: PropTypes.bool,
  rounded: PropTypes.bool,
  redirectEnabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    variablesList: state.VariablesReducer.variablesList,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(CreateProjectLink);
