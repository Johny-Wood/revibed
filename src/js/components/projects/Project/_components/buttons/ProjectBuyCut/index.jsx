import { useCallback, useMemo } from 'react';

import { connect } from 'react-redux';

import BuyOnMarketplaceLink from '@/components/projects/Project/_components/buttons/BuyOnMarketplaceLink';
import ProjectActionButton from '@/components/projects/Project/_components/buttons/ProjectActionButton';
import { CommonMessagesConstants } from '@/constants/common/message';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import NextRouter from '@/services/NextRouter';
import { getFreeBonusesGemSlotsUtil, getFreeBonusesGoldenCoinSlotsUtil } from '@/utils/project/projectBonusesUtil';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { availableSlotsForUserUtil, isUseBuyGemUtil, isUseBuyGoldenCoinUtil } from '@/utils/project/projectUseBonusesUtil';

const onJoinProject = ({ withRoute, projectUrl, showBuyPopup }) => {
  const { router } = NextRouter.getInstance();

  if (withRoute) {
    router.push(projectUrl).then(() => {
      showBuyPopup();
    });
  } else {
    showBuyPopup();
  }
};

function ProjectBuyCut({
  goodsId,
  canBeLateEntryStatus,
  isLegacyStatus,
  participationContributor,
  projectId,
  title,
  withRoute,
  lateEntryInfo: { slots: lateEntrySlots = [] } = {},
  freeBonuses: { slots: freeBonusesSlots = [] } = {},
  isLateEntryStatus,

  userIsAuthorized,
  userInfo: { goldenCoinsCount, gemsCount = 0 } = {},
  variablesList: { CONTRIBUTE_PROJECT_USE_GEM_ALLOWED } = {},
  showPopup,
}) {
  const projectUrl = createProjectUrlUtil(projectId, title);

  const freeBonusesGemSlotsCount = useMemo(() => getFreeBonusesGemSlotsUtil({ freeBonusesSlots }).length, [freeBonusesSlots]);
  const freeBonusesGoldenCoinSlotsCount = useMemo(
    () => getFreeBonusesGoldenCoinSlotsUtil({ freeBonusesSlots }).length,
    [freeBonusesSlots]
  );

  const isUseGoldenCoin = useMemo(
    () =>
      isUseBuyGoldenCoinUtil({
        goldenCoinsCount,
        freeBonusesGoldenCoinSlotsCount,
      }),
    [goldenCoinsCount, freeBonusesGoldenCoinSlotsCount]
  );

  const isUseGem = useMemo(
    () =>
      isUseBuyGemUtil({
        gemsCount,
        freeBonusesGoldenCoinSlotsCount,
        goldenCoinsCount,
        freeBonusesGemSlotsCount,
        CONTRIBUTE_PROJECT_USE_GEM_ALLOWED,
      }),
    [gemsCount, freeBonusesGoldenCoinSlotsCount, goldenCoinsCount, freeBonusesGemSlotsCount, CONTRIBUTE_PROJECT_USE_GEM_ALLOWED]
  );

  const textJoin = useMemo(() => CommonMessagesConstants.PREORDER, []);

  const showBuyPopup = useCallback(() => {
    showPopup(PopupProjectIdsConstants.MultiCutPopup, {
      projectId,
      isUseGoldenCoin,
      isUseGem,
      participationContributor,
      isLateEntryStatus,
      freeBonusesGemSlotsCount,
      freeBonusesGoldenCoinSlotsCount,
      lateEntrySlots,
    });
  }, [
    freeBonusesGemSlotsCount,
    freeBonusesGoldenCoinSlotsCount,
    isLateEntryStatus,
    isUseGem,
    isUseGoldenCoin,
    lateEntrySlots,
    participationContributor,
    projectId,
    showPopup,
  ]);

  const isWithoutBonus = useMemo(
    () =>
      isLateEntryStatus &&
      (!userIsAuthorized ||
        availableSlotsForUserUtil({
          slots: lateEntrySlots,
          gemsCount,
          goldenCoinsCount,
        }).length === 0),
    [isLateEntryStatus, userIsAuthorized, lateEntrySlots, gemsCount, goldenCoinsCount]
  );

  if (isLegacyStatus && !goodsId) {
    return null;
  }

  if (isLegacyStatus && !canBeLateEntryStatus && !!goodsId) {
    return <BuyOnMarketplaceLink goodsId={goodsId} />;
  }

  return (
    <ProjectActionButton
      text={textJoin}
      title={textJoin}
      isUseGoldenCoin={isUseGoldenCoin}
      isUseGem={isUseGem}
      isUseGoldenCoinVisible={isWithoutBonus}
      transparent
      participationContributor={participationContributor}
      className="button-buy-cut"
      routeBefore={projectUrl}
      borderColor="gray-3"
      type="BUY_CUT"
      onClick={() => {
        if (isLateEntryStatus && !isUseGem && !isUseGoldenCoin && !participationContributor) {
          showPopup(PopupProjectIdsConstants.HotOffersWithoutBonusErrorPopup);
        } else {
          onJoinProject({ withRoute, projectUrl, showBuyPopup });
        }
      }}
    />
  );
}

export default connect(
  (state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    userInfo: state.AuthReducer.userInfo,
    variablesList: state.VariablesReducer.variablesList,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(ProjectBuyCut);
