import type { Action } from 'redux';
import { combineReducers } from 'redux';

import { AuthActionsConstants } from '@/constants/actions/auth/auth';
import MarketplaceAndPreOrdersFiltersReducer from '@/js/redux/reducers/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersReducer';
import CashbackReducer from '@/js/redux/reducers/personal/cashbackReducer';

import AccountNotificationsSettingsEmailReducer from './account/accountNotificationsSettingsEmailReducer';
import AccountNotificationsSettingsTelegramReducer from './account/accountNotificationsSettingsTelegramReducer';
import ArtistFundReducer from './artistFundReducer';
import AuthReducer from './auth/authReducer';
import ResetPasswordReducer from './auth/resetPasswordReducer';
import BlogReducer from './blog/blogReducer';
import BannersReducer from './common/bannersReducer';
import GlobalReducer from './common/globalReducer';
import RatingReducer from './common/ratingReducer';
import RulesReducer from './common/rulesReducer';
import VariablesReducer from './common/variablesReducer';
import DarkOverlayReducer from './components/darkOverlayReducer';
import MessageReducer from './components/messageReducer';
import PopupReducer from './components/popupReducer';
import ScrollReducer from './components/scrollReducer';
import VideoPlayerReducer from './components/videoPlayerReducer';
import ConfirmPhoneReducer from './confirm/confirmPhoneReducer';
import CreateProjectReducer from './create-project/createProjectReducer';
import AdminDialogReducer from './dialog/adminDialogReducer';
import ProjectCommentsReducer from './dialog/projectCommentsReducer';
import ConfirmEmailReducer from './email/confirmEmailReducer';
import UnsubscribeReducer from './email/unsubscribeReducer';
import FundingNowEventsReducer from './events/fundingNowEventsReducer';
import LastRippedEventsReducer from './events/lastRippedEventsReducer';
import FaqReducer from './faq/faqReducer';
import FeedbackReducer from './feedback/feedbackReducer';
import MarketplaceComingSoonListReducer from './marketplace/list/marketplaceComingSoonListReducer';
import MarketplaceListReducer from './marketplace/list/marketplaceListReducer';
import MarketplaceNewReleasesListReducer from './marketplace/list/marketplaceNewReleasesListReducer';
import MarketplaceCardReducer from './marketplace/marketplaceCardReducer';
import MarketplaceCartReducer from './marketplace/marketplaceCartReducer';
import PersonalActiveGemsReducer from './personal/active-points/personalActiveGemsReducer';
import PersonalActiveGoldenCoinReducer from './personal/active-points/personalActiveGoldenCoinReducer';
import BalanceReducer from './personal/balanceReducer';
import FriendsReducer from './personal/friendsReducer';
import PaymentsReducer from './personal/paymentsReducer';
import PersonalNotificationCountsReducer from './personal/personalNotificationCountsReducer';
import PersonalNotificationsReducer from './personal/personalNotificationsReducer';
import PersonalReducer from './personal/personalReducer';
import PersonalUserNotificationsReducer from './personal/personalUserNotificationsReducer';
import ProjectsStatsReducer from './personal/projectsStatsReducer';
import PurchasesReducer from './personal/purchasesReducer';
import ReferralReducer from './personal/referralReducer';
import WithdrawReducer from './personal/withdrawReducer';
import ProjectBalanceReducer from './project/projectBalanceReducer';
import ProjectCardReducer from './project/projectCardReducer';
import ProjectInviteReducer from './project/projectInviteReducer';
import ProjectRipLinkReducer from './project/projectRipLinkReducer';
import ProjectRipperReducer from './project/projectRipperReducer';
import DataForProjectReducer from './projects/dataForProjectReducer';
import DefaultProjectsReducer from './projects/list/defaultProjectsReducer';
import HotOffersProjectsReducer from './projects/list/hotOffersProjectsReducer';
import LateEntryProjectsReducer from './projects/list/lateEntryProjectsReducer';
import MyFeedReducer from './projects/list/myFeedReducer';
import MyProjectsReducer from './projects/list/myProjectsReducer';
import NewArrivalsProjectsReducer from './projects/list/newArrivalsProjectsReducer';
import RipperProjectsReducer from './projects/list/ripperProjectsReducer';
import UserProjectsReducer from './projects/list/userProjectsReducer';
import PromoReducer from './promo/promoReducer';
import ReactionsReducer from './reactions/reactionsReducer';
import SocialConnectReducer from './socialConnectReducer';
import MarketplaceSortAndFiltersReducer from './sort-and-filter/marketplaceSortAndFiltersReducer';
import ProjectsSortAndFiltersReducer from './sort-and-filter/projectsSortAndFiltersReducer';
import WantedSortAndFiltersReducer from './sort-and-filter/wantedSortAndFiltersReducer';
import WantListReleasesItemsSortAndFiltersReducer from './sort-and-filter/wantListReleasesItemsSortAndFiltersReducer';
import WantListReleasesSortAndFiltersReducer from './sort-and-filter/wantListReleasesSortAndFiltersReducer';
import TrendingReducer from './trending/trendingReducer';
import UsersReducer from './users/usersReducer';
import VotingReducer from './voting/votingReducer';
import WantedReducer from './wanted/wantedReducer';
import WantListReducer from './wantList/wantListReducer';
import WantListReleaseItemReducer from './wantList/wantListReleaseItemReducer';
import WantListReleasesItemsReducer from './wantList/wantListReleasesItemsReducer';
import WebsocketSubscribeReducer from './websocket/subscribeReducer';

const dependentLogOutReducers = {
  AuthReducer,
  PersonalReducer,
  PersonalNotificationCountsReducer,
  PersonalNotificationsReducer,
  RipperProjectsReducer,
  MyProjectsReducer,
  UserProjectsReducer,
  ProjectsStatsReducer,
  ProjectCommentsReducer,
  ProjectBalanceReducer,
  ProjectRipperReducer,
  VotingReducer,
  CreateProjectReducer,
  BalanceReducer,
  PaymentsReducer,
  WithdrawReducer,
  ReferralReducer,
  PersonalActiveGemsReducer,
  PersonalActiveGoldenCoinReducer,
  PurchasesReducer,
  FriendsReducer,
  AccountNotificationsSettingsEmailReducer,
  AccountNotificationsSettingsTelegramReducer,
  PersonalUserNotificationsReducer,
  AdminDialogReducer,
  UsersReducer,
  MarketplaceCartReducer,
  MyFeedReducer,
};

const dependentAuthReducers = {
  MarketplaceCardReducer,
  MarketplaceNewReleasesListReducer,
  MarketplaceComingSoonListReducer,
  MarketplaceAndPreOrdersFiltersReducer,
  MarketplaceListReducer,
  HotOffersProjectsReducer,
  NewArrivalsProjectsReducer,
  LateEntryProjectsReducer,
  DefaultProjectsReducer,
  ProjectCardReducer,
  TrendingReducer,
  BannersReducer,
  LastRippedEventsReducer,
  WantListReducer,
  WantListReleasesItemsReducer,
  WantListReleaseItemReducer,
  WebsocketSubscribeReducer,
  PromoReducer,
  ProjectsSortAndFiltersReducer,
  WantListReleasesSortAndFiltersReducer,
  WantListReleasesItemsSortAndFiltersReducer,
  MarketplaceSortAndFiltersReducer,
  BlogReducer,
  CashbackReducer,
};

const commonReducers = {
  VariablesReducer,
  GlobalReducer,
  RulesReducer,
  RatingReducer,
  FundingNowEventsReducer,
  PopupReducer,
  MessageReducer,
  ScrollReducer,
  ResetPasswordReducer,
  ConfirmEmailReducer,
  UnsubscribeReducer,
  SocialConnectReducer,
  DataForProjectReducer,
  ProjectInviteReducer,
  ProjectRipLinkReducer,
  WebsocketSubscribeReducer,
  FaqReducer,
  FeedbackReducer,
  ConfirmPhoneReducer,
  VideoPlayerReducer,
  DarkOverlayReducer,
  WantedSortAndFiltersReducer,
  WantedReducer,
  ArtistFundReducer,
  ReactionsReducer,
};

const combinedReducer = combineReducers({
  ...commonReducers,
  ...dependentAuthReducers,
  ...dependentLogOutReducers,
});

export type RootState = ReturnType<typeof combinedReducer>;

function crossSliceReducer(state: RootState, action: Action) {
  const newState = state;

  const isSignInAction =
    action.type === AuthActionsConstants.SIGN_UP_SUCCESS || action.type === AuthActionsConstants.SIGN_IN_WITH_PASSWORD_SUCCESS;
  const isLogOutAction = action.type === AuthActionsConstants.SIGN_OUT;

  function setInitialState(reducers = {}) {
    Object.keys(reducers).forEach((key) => {
      // @ts-ignore
      newState[key] = reducers[key](undefined, action);
    });
  }

  if (isLogOutAction || isSignInAction) {
    setInitialState(dependentAuthReducers);
  }

  if (isLogOutAction) {
    setInitialState(dependentLogOutReducers);
  }

  return newState;
}

const rootReducer = (state: RootState, action: Action) => {
  const intermediateState = combinedReducer(state, action);

  return crossSliceReducer(intermediateState, action);
};

export default rootReducer;
