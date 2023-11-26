import { Component, Fragment } from 'react';

import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { closePopupAction, showPopupAction } from '@/redux-actions/components/popupActions';

const PaymentSuccessMessage = dynamic(() => import('@/components/global/Messages/payments/PaymentSuccessMessage'), {
  ssr: false,
});
const ConfirmPurchasePopup = dynamic(() => import('@/components/global/Popups/cart/ConfirmPurchasePopup'), {
  ssr: false,
});
const DefaultWarningPopup = dynamic(() => import('@/components/global/Popups/common/DefaultWarningPopup'), {
  ssr: false,
});
const SuccessPopup = dynamic(() => import('@/components/global/Popups/common/SuccessPopup'), {
  ssr: false,
});
const WarningPopup = dynamic(() => import('@/components/global/Popups/common/WarningPopup'), {
  ssr: false,
});
const ConfirmedEmailPopup = dynamic(() => import('@/components/global/Popups/email/ConfirmedEmailPopup'), {
  ssr: false,
});
const EmailAlreadyConfirmedPopup = dynamic(() => import('@/components/global/Popups/email/EmailAlreadyConfirmedPopup'), {
  ssr: false,
});
const EmailAlreadyExistsPopup = dynamic(() => import('@/components/global/Popups/email/EmailAlreadyExistsPopup'), {
  ssr: false,
});
const EmailMustBeConfirmedWarningPopup = dynamic(
  () => import('@/components/global/Popups/email/EmailMustBeConfirmedWarningPopup'),
  { ssr: false }
);
const EmailSentToPopup = dynamic(() => import('@/components/global/Popups/email/EmailSentToPopup'), { ssr: false });
const EmailSentToSuccessPopup = dynamic(() => import('@/components/global/Popups/email/EmailSentToSuccessPopup'), {
  ssr: false,
});
const ResetPasswordPopup = dynamic(() => import('@/components/global/Popups/email/ResetPasswordPopup'), { ssr: false });
const ChangePasswordSuccessPopup = dynamic(() => import('@/components/global/Popups/password/ChangePasswordSuccessPopup'), {
  ssr: false,
});
const ResetPasswordSuccessPopup = dynamic(() => import('@/components/global/Popups/password/ResetPasswordSuccessPopup'), {
  ssr: false,
});
const GoldenCoinPopup = dynamic(() => import('@/components/global/Popups/personal/GoldenCoinPopup'), { ssr: false });
const BannedUserPopup = dynamic(() => import('@/components/global/Popups/personal/profile/BannedUserPopup'), {
  ssr: false,
});
const ChangeAvatarPopup = dynamic(() => import('@/components/global/Popups/personal/profile/ChangeAvatarPopup'), {
  ssr: false,
});
const ChangePersonalInformationSuccessPopup = dynamic(
  () => import('@/components/global/Popups/personal/profile/ChangePersonalInformationSuccessPopup'),
  { ssr: false }
);
const ChangeWantListSettingsSubscriptionSuccessPopup = dynamic(
  () => import('@/components/global/Popups/personal/profile/ChangeWantListSettingsSubscriptionSuccessPopup'),
  { ssr: false }
);
const EditProfileFieldsPopup = dynamic(() => import('@/components/global/Popups/personal/profile/EditProfileFieldsPopup'), {
  ssr: false,
});
const FavoriteStylesPopup = dynamic(() => import('@/components/global/Popups/personal/profile/FavoriteStylesPopup'), {
  ssr: false,
});
const ShareInvitePopup = dynamic(() => import('@/components/global/Popups/personal/share-invite/ShareInvitePopup'), {
  ssr: false,
});
const AddAdditionalExpensesPopup = dynamic(() => import('@/components/global/Popups/project/AddAdditionalExpensesPopup'), {
  ssr: false,
});
const HowPreOrderWorksPopup = dynamic(() => import('@/components/global/Popups/project/HowPreOrderWorksPopup/index'), {
  ssr: false,
});
const ContributorsPopup = dynamic(() => import('@/components/global/Popups/project/contributors/ContributorsPopup'), {
  ssr: false,
});
const CreateProjectsDisabledPopup = dynamic(() => import('@/components/global/Popups/project/CreateProjectsDisabledPopup'), {
  ssr: false,
});
const DeleteDraftProjectPopup = dynamic(() => import('@/components/global/Popups/project/draft/DeleteDraftProjectPopup'), {
  ssr: false,
});
const DeleteDraftProjectSuccessPopup = dynamic(
  () => import('@/components/global/Popups/project/draft/DeleteDraftProjectSuccessPopup'),
  { ssr: false }
);
const EditDraftProjectSuccessPopup = dynamic(
  () => import('@/components/global/Popups/project/draft/EditDraftProjectSuccessPopup'),
  { ssr: false }
);
const HotOffersWithoutBonusErrorPopup = dynamic(
  () => import('@/components/global/Popups/project/HotOffersWithoutBonusErrorPopup'),
  { ssr: false }
);
const InsufficientFundsPopup = dynamic(
  () => import('@/components/global/Popups/project/insufficient-funds/InsufficientFundsPopup'),
  { ssr: false }
);
const ItemsForSaleProjectsPopup = dynamic(
  () => import('@/components/global/Popups/project/items-for-sale/ItemsForSaleProjectsPopup'),
  { ssr: false }
);
const MultiCutPopup = dynamic(() => import('@/components/global/Popups/project/multi-cut/MultiCutPopup'), {
  ssr: false,
});
const ProjectInvitePopup = dynamic(() => import('@/components/global/Popups/project/ProjectInvitePopup'), {
  ssr: false,
});
const ProjectNotFoundPopup = dynamic(() => import('@/components/global/Popups/project/ProjectNotFoundPopup'), {
  ssr: false,
});
const ProjectSharePopup = dynamic(() => import('@/components/global/Popups/project/ProjectSharePopup'), { ssr: false });
const PublishProjectSuccessPopup = dynamic(() => import('@/components/global/Popups/project/PublishProjectSuccessPopup'), {
  ssr: false,
});
const ProjectRipperSavePopup = dynamic(() => import('@/components/global/Popups/project/ripper-save/ProjectRipperSavePopup'), {
  ssr: false,
});
const ProjectUploadFilesPopup = dynamic(() => import('@/components/global/Popups/project/upload-files/ProjectUploadFilesPopup'), {
  ssr: false,
});
const RipperUseCoinsAllowedPopup = dynamic(() => import('@/components/global/Popups/ripper/RipperUseCoinsAllowedPopup'), {
  ssr: false,
});
const InvalidTokenPopup = dynamic(() => import('@/components/global/Popups/token/InvalidTokenPopup'), { ssr: false });
const NoSuchTokenPopup = dynamic(() => import('@/components/global/Popups/token/NoSuchTokenPopup'), { ssr: false });
const AddWantListReleasePopup = dynamic(
  () => import('@/components/global/Popups/wantList/add/add-release/AddWantListReleasePopup'),
  { ssr: false }
);
const AddWantListReleaseForWatchPopup = dynamic(
  () => import('@/components/global/Popups/wantList/add/AddWantListReleaseForWatchPopup'),
  { ssr: false }
);
const WantListSubscriptionNoPlacesPopup = dynamic(
  () => import('@/components/global/Popups/wantList/add/WantListSubscriptionNoPlacesPopup'),
  { ssr: false }
);
const WantListImportSuccessPopup = dynamic(
  () => import('@/components/global/Popups/wantList/import/WantListImportSuccessPopup'),
  { ssr: false }
);
const ChangePlanWantListPopup = dynamic(() => import('@/components/global/Popups/wantList/plan/ChangePlanWantListPopup'), {
  ssr: false,
});
const RemoveWantListReleaseForWatchPopup = dynamic(
  () => import('@/components/global/Popups/wantList/remove/RemoveWantListReleaseForWatchPopup'),
  { ssr: false }
);
const RemoveWantListReleasePopup = dynamic(
  () => import('@/components/global/Popups/wantList/remove/RemoveWantListReleasePopup'),
  { ssr: false }
);
const FileInvalidSizePopup = dynamic(() => import('@/components/global/Popups/files/FileInvalidSizePopup'), {
  ssr: false,
});
const FileInvalidMimeTypePopup = dynamic(() => import('@/components/global/Popups/files/FileInvalidMimeTypePopup'), {
  ssr: false,
});

const popupComponents = () => ({
  SuccessPopup: () => SuccessPopup,
  WarningPopup: () => WarningPopup,
  DefaultWarningPopup: () => DefaultWarningPopup,
  EmailMustBeConfirmedWarningPopup: () => EmailMustBeConfirmedWarningPopup,
  EmailAlreadyExistsPopup: () => EmailAlreadyExistsPopup,
  EmailSentToPopup: () => EmailSentToPopup,
  ConfirmedEmailPopup: () => ConfirmedEmailPopup,
  EmailAlreadyConfirmedPopup: () => EmailAlreadyConfirmedPopup,
  EmailSentToSuccessPopup: () => EmailSentToSuccessPopup,
  ResetPasswordPopup: () => ResetPasswordPopup,
  InvalidTokenPopup: () => InvalidTokenPopup,
  NoSuchTokenPopup: () => NoSuchTokenPopup,
  ResetPasswordSuccessPopup: () => ResetPasswordSuccessPopup,
  ChangePasswordSuccessPopup: () => ChangePasswordSuccessPopup,
  ChangePersonalInformationSuccessPopup: () => ChangePersonalInformationSuccessPopup,
  ChangeWantListSettingsSubscriptionSuccessPopup: () => ChangeWantListSettingsSubscriptionSuccessPopup,
  ProjectSharePopup: () => ProjectSharePopup,
  ShareInvitePopup: () => ShareInvitePopup,
  BannedUserPopup: () => BannedUserPopup,
  InsufficientFundsPopup: () => InsufficientFundsPopup,
  PublishProjectSuccessPopup: () => PublishProjectSuccessPopup,
  ProjectNotFoundPopup: () => ProjectNotFoundPopup,
  EditDraftProjectSuccessPopup: () => EditDraftProjectSuccessPopup,
  DeleteDraftProjectSuccessPopup: () => DeleteDraftProjectSuccessPopup,
  DeleteDraftProjectPopup: () => DeleteDraftProjectPopup,
  ProjectInvitePopup: () => ProjectInvitePopup,
  CreateProjectsDisabledPopup: () => CreateProjectsDisabledPopup,
  HotOffersWithoutBonusErrorPopup: () => HotOffersWithoutBonusErrorPopup,
  RipperUseCoinsAllowedPopup: () => RipperUseCoinsAllowedPopup,
  PaymentSuccessMessage: () => PaymentSuccessMessage,
  EditProfileFieldsPopup: () => EditProfileFieldsPopup,
  ChangeAvatarPopup: () => ChangeAvatarPopup,
  MultiCutPopup: () => MultiCutPopup,
  FavoriteStylesPopup: () => FavoriteStylesPopup,
  AddWantListReleasePopup: () => AddWantListReleasePopup,
  RemoveWantListReleasePopup: () => RemoveWantListReleasePopup,
  RemoveWantListReleaseForWatchPopup: () => RemoveWantListReleaseForWatchPopup,
  WantListImportSuccessPopup: () => WantListImportSuccessPopup,
  AddWantListReleaseForWatchPopup: () => AddWantListReleaseForWatchPopup,
  WantListSubscriptionNoPlacesPopup: () => WantListSubscriptionNoPlacesPopup,
  ConfirmPurchasePopup: () => ConfirmPurchasePopup,
  ItemsForSaleProjectsPopup: () => ItemsForSaleProjectsPopup,
  GoldenCoinPopup: () => GoldenCoinPopup,
  ProjectUploadFilesPopup: () => ProjectUploadFilesPopup,
  AddAdditionalExpensesPopup: () => AddAdditionalExpensesPopup,
  ProjectRipperSavePopup: () => ProjectRipperSavePopup,
  ContributorsPopup: () => ContributorsPopup,
  ChangePlanWantListPopup: () => ChangePlanWantListPopup,
  FileInvalidMimeTypePopup: () => FileInvalidMimeTypePopup,
  FileInvalidSizePopup: () => FileInvalidSizePopup,
  HowPreOrderWorksPopup: () => HowPreOrderWorksPopup,
});

const popupComponentProps = {};

const createKey = (popupId, idx = 0) => `popup-key-${popupId}-${idx}`;

class Popups extends Component {
  renderActivePopup = (isOnly) => {
    const { activePopupList: activePopupListAll, closePopup, showPopup, variables } = this.props;

    const activePopupList =
      activePopupListAll.filter(({ popupData: { isOnly: isOnlyPopup } = {} }) => isOnlyPopup === isOnly) || [];

    if (activePopupList.length === 0) {
      return null;
    }

    return activePopupList.map((popupItem, idx) => {
      const { popupId, popupData } = popupItem;

      let popupComponentGeneratorProps = {};
      const popupComponentPropsArray = popupComponentProps[popupId] || [];

      popupComponentPropsArray.forEach((prop) => {
        const { props } = this;
        popupComponentGeneratorProps = {
          ...popupComponentGeneratorProps,
          [prop]: props[prop],
        };
      });

      const popupComponentGenerator = popupComponents(popupComponentGeneratorProps)[popupId];

      if (!popupComponentGenerator) {
        return null;
      }

      popupData.propsForBasePopup = {
        ...popupData.propsForBasePopup,
        closePopup,
        showPopup,
      };

      const PopupComponent = popupComponentGenerator();

      if (PopupComponent) {
        return (
          <Fragment key={`popup-fragment-${createKey(popupId, idx)}`}>
            <PopupComponent
              key={createKey(popupId, idx)}
              popupId={popupId}
              popupData={popupData}
              closePopup={closePopup}
              showPopup={showPopup}
              variables={variables}
            />
          </Fragment>
        );
      }

      return null;
    });
  };

  render() {
    const { activePopupList = [] } = this.props;

    const activePopupNotOnlyList = activePopupList.filter(({ popupData: { isOnly: isOnlyPopup } = {} }) => !isOnlyPopup) || [];

    const { popupId: firstActivePopupNotOnly = '' } = activePopupNotOnlyList[0] || {};

    return (
      <TransitionSwitchLayout
        isShown={activePopupNotOnlyList.length > 0}
        transitionKey={`${firstActivePopupNotOnly}-${activePopupNotOnlyList.length}`}
        duration={200}
        name="popup-save"
      >
        <div className="popups_not_only">{this.renderActivePopup()}</div>
      </TransitionSwitchLayout>
    );
  }
}

export default connect(
  (state) => ({
    activePopupList: state.PopupReducer.activePopupList,
    variables: state.VariablesReducer.variables,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    closePopup: (popupId) => {
      dispatch(closePopupAction(popupId));
    },
  })
)(Popups);
