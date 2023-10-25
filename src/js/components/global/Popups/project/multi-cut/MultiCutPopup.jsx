import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import CreateProjectBonusCheckbox from '@/components/forms/project/AddProjectForm/_components/CreateProjectBonusCheckbox';
import Popup from '@/components/primary/Popup';
import PopupActionButton from '@/components/primary/Popup/_components/PopupActionButton';
import Coin from '@/components/ui/currency/Coin';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import LateEntrySlotTypesConstants from '@/constants/lateEntry/slot-types';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupCommonIdsConstants, PopupProjectIdsConstants } from '@/constants/popups/id';
import GemIcon from '@/icons/GemIcon';
import GoldenCoinIcon from '@/icons/GoldenCoinIcon';
import GoldenCoinIconBigShadow from '@/icons/GoldenCoinIconBigShadow';
import { buyCutRequestAction, deleteProjectCardFreeBonusSlotAction } from '@/redux-actions/project/projectCardActions';
import { deleteFreeBonusSlotFromPreviewAction } from '@/redux-actions/projects/projectsActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeCheckBoxHandler, setInputError } from '@/utils/inputHandlersUtil';
import { getFreeBonusesGemSlotsUtil, getFreeBonusesGoldenCoinSlotsUtil } from '@/utils/project/projectBonusesUtil';
import { projectParticipationInfoUtil } from '@/utils/project/projectParticipationInfoUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { isUseBuyGemUtil, isUseBuyGoldenCoinUtil } from '@/utils/project/projectUseBonusesUtil';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';
import { ValidateBadRequestUtil } from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

class MultiCutPopup extends Component {
  constructor(props) {
    super(props);

    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);
    this.setInputError = setInputError.bind(this);

    const cutsCountMin = this.getMinCutsCount(this.isUseGem()) || 1;
    const cutsCountEnd = this.isUseGem() ? this.getMinCutsCountForBonus() : cutsCountMin;

    this.state = {
      cutsCount: cutsCountEnd,
      cutsCountError: false,

      participantUseGem: this.isUseGem() || false,
      participantUseGemError: false,
      participantUseGemErrorMsg: '',

      cutsCountHandChanged: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { participantUseGem, cutsCount: cutsCountState, cutsCountHandChanged } = this.state;
    const { participantUseGem: participantUseGemPrev } = prevState;

    const { popupData: { projectId } = {} } = this.props;
    const projectCard = this.getProjectInfo();

    const { projectCards: projectCardsPrev = [] } = prevProps;
    const projectCardPrev = (projectCardsPrev[0] || {})[projectId] || {};

    const { totalCutsCount = 0, cutsCount = 0, requestedUserInfo: { contributor: { participation } = {} } = {} } = projectCard;

    const {
      totalCutsCount: totalCutsCountPrev = 0,
      cutsCount: cutsCountPrev = 0,
      requestedUserInfo: { contributor: { participation: participationPrev } = {} } = {},
    } = projectCardPrev;

    if (
      participation !== participationPrev ||
      totalCutsCount - cutsCount !== totalCutsCountPrev - cutsCountPrev ||
      (participantUseGem !== participantUseGemPrev &&
        (!cutsCountHandChanged || (this.getMinCutsCount() > cutsCountState && cutsCountHandChanged)))
    ) {
      this.updateCutsCount();
    }
  }

  updateCutsCount = () => {
    this.setState({
      cutsCount: this.getMinCutsCount(),
    });
  };

  getProjectInfo = () => {
    const { projectCards = [], popupData: { projectId } = {} } = this.props;

    return (projectCards[0] || {})[projectId] || {};
  };

  getMinCutsCountForBonus = () => {
    const { variablesList: { CONTRIBUTE_PROJECT_GEM_VALUE_PERCENTAGE } = {} } = this.props;

    const { totalCutsCount = 0, cutsCount = 0 } = this.getProjectInfo();

    return Math.min(CONTRIBUTE_PROJECT_GEM_VALUE_PERCENTAGE, totalCutsCount - cutsCount);
  };

  getMinCutsCount = (isUseGem) => {
    const { participantUseGem } = this.state || {};

    const {
      minCutsCount = 1,
      totalCutsCount = 0,
      cutsCount = 0,
      requestedUserInfo: { contributor: { participation } = {} } = {},
    } = this.getProjectInfo();

    if (isUseGem || participantUseGem) {
      return this.getMinCutsCountForBonus();
    }

    return participation ? 1 : Math.max(Math.min(minCutsCount, totalCutsCount - cutsCount), 0);
  };

  canBeLateEntryStatus = () => {
    const { userIsAuthorized } = this.props;

    return projectsStatusesUtil.canBeLateEntryStatus(this.getProjectInfo(), { userIsAuthorized });
  };

  isLateEntryStatus = () => {
    const { popupData: { isLateEntryStatus } = {} } = this.props;

    const { lateEntryStatus: { name: lateEntryStatusName } = {} } = this.getProjectInfo();

    return (this.canBeLateEntryStatus() && projectsStatusesUtil.isLateEntryStatus(lateEntryStatusName)) || isLateEntryStatus;
  };

  disabledButCutButton = () => {
    const { buyCutInProcess } = this.props;
    const { cutsCountError, cutsCount } = this.state;

    const { totalCutsCount, cutsCount: cutsCountProject } = this.getProjectInfo();

    const minCutsCount = this.getMinCutsCount();

    return (
      buyCutInProcess ||
      cutsCountError ||
      (!this.isLateEntryStatus() &&
        ((minCutsCount >= 0 && cutsCount < minCutsCount) || cutsCount > totalCutsCount - cutsCountProject))
    );
  };

  onBuyMultiCut = () =>
    new Promise((resolve, reject) => {
      const { showPopup, buyCutRequest, popupData: { projectId } = {}, closePopup } = this.props;

      const { cutsCount } = this.state;

      const { totalCutsCount, cutsCount: cutsCountProject } = this.getProjectInfo();

      const minCutsCount = this.getMinCutsCount();

      if (this.disabledButCutButton()) {
        reject();
        return;
      }

      buyCutRequest({
        id: projectId,
        cutsCount: !this.isLateEntryStatus() ? cutsCount : 1,
        useGoldenCoin: this.isUseGoldenCoin() && !this.isLateEntryStatus(),
        isUseGem: this.isUsedGem() && !this.isLateEntryStatus(),
        saveProjectInfo: this.isLateEntryStatus(),
        withSubscribe: this.isLateEntryStatus(),
        buttonType: !this.isParticipationContributor() ? 'JOIN' : 'MORE_CUTS',
      })
        .then(() => {
          closePopup(PopupProjectIdsConstants.MultiCutPopup);

          showPopup(
            PopupCommonIdsConstants.SuccessPopup,
            {
              text: !this.isParticipationContributor()
                ? MessagesSuccessConstants.JOIN_PROJECT
                : MessagesSuccessConstants.MULTI_CUT,
            },
            false
          );

          resolve();
        })
        .catch(({ error, payload: { errorField } = {} }) => {
          if (error) {
            handleErrorUtil(error, {
              BAD_REQUEST: () => {
                this.badRequest(errorField);
              },
              INSUFFICIENT_FUNDS: () => {
                showPopup(PopupProjectIdsConstants.InsufficientFundsPopup, {}, true);
              },
              PROJECT_NOT_FOUND: () => {
                showPopup(PopupProjectIdsConstants.ProjectNotFoundPopup, {}, true);
              },
              JOIN_TO_PROJECT_NO_PLACES: () => {
                if (
                  !this.isParticipationContributor() &&
                  this.isLateEntryStatus() &&
                  (this.isUseGoldenCoin() || this.isUseGem())
                ) {
                  showPopup(PopupCommonIdsConstants.WarningPopup, {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_NO_PLACES,
                  });
                } else {
                  this.setInputError('cutsCount', `${CommonErrorMessages.MAX_VALUE}${totalCutsCount - cutsCountProject}`);
                }
              },
              JOIN_TO_PROJECT_SMALL_START_CUT: () => {
                this.setInputError('cutsCount', `${CommonErrorMessages.MIN_VALUE}${minCutsCount}`);
              },
              JOIN_TO_PROJECT_STATUS_NOT_ALLOWED: () => {
                showPopup(
                  PopupCommonIdsConstants.WarningPopup,
                  {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_STATUS_NOT_ALLOWED,
                  },
                  true
                );
              },
              JOIN_TO_PROJECT_PERMISSION_DENIED: () => {
                showPopup(
                  PopupCommonIdsConstants.WarningPopup,
                  {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_PERMISSION_DENIED,
                  },
                  true
                );
              },
              JOIN_TO_PROJECT_ALREADY_CONTRIBUTOR: () => {
                showPopup(
                  PopupCommonIdsConstants.WarningPopup,
                  {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_ALREADY_CONTRIBUTOR,
                  },
                  true
                );
              },
              JOIN_TO_PROJECT_BONUSES_NOT_PRESENT: () => {
                showPopup(
                  PopupCommonIdsConstants.WarningPopup,
                  {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_BONUSES_NOT_PRESENT,
                  },
                  true
                );
              },
              JOIN_TO_PROJECT_CUTS_COUNT_FOR_USER_LIMIT_EXCEEDED: () => {
                showPopup(
                  PopupCommonIdsConstants.WarningPopup,
                  {
                    text: MessagesErrorConstants.JOIN_TO_PROJECT_CUTS_COUNT_FOR_USER_LIMIT_EXCEEDED,
                  },
                  true
                );
              },
              JOIN_TO_PROJECT_GOLDEN_COIN_NOT_EXISTS: () => {
                this.deleteFreeBonusGoldenCoinSlot({
                  errorMsg: MessagesErrorConstants.JOIN_TO_PROJECT_GOLDEN_COIN_NOT_EXISTS,
                });
              },
              JOIN_TO_PROJECT_GOLDEN_COIN_NOT_ALLOWED: () => {
                this.deleteFreeBonusGoldenCoinSlot();
              },
              JOIN_TO_PROJECT_GEM_NOT_EXISTS: () => {
                this.deleteFreeBonusGemSlot();
              },
              JOIN_TO_PROJECT_GEM_NOT_ALLOWED: () => {
                this.deleteFreeBonusGemSlot({
                  errorMsg: MessagesErrorConstants.JOIN_TO_PROJECT_GEM_NOT_ALLOWED,
                });
              },
              USE_GEM_FOR_CONTRIBUTE_PROJECT_NOT_ALLOWED: () => {
                this.deleteFreeBonusGemSlot();
              },
            });
          }

          reject();
        });
    });

  deleteFreeBonusGoldenCoinSlot = ({ errorMsg = MessagesErrorConstants.JOIN_TO_PROJECT_GOLDEN_COIN_NOT_ALLOWED } = {}) => {
    const { popupData: { projectId } = {}, deleteFreeBonusSlotFromPreview, deleteFreeBonusSlot, showPopup } = this.props;

    showPopup(
      PopupCommonIdsConstants.WarningPopup,
      {
        text: errorMsg,
      },
      true
    );

    deleteFreeBonusSlotFromPreview({
      type: LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
      projectId,
      removeAll: true,
    });
    deleteFreeBonusSlot({
      type: LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
      projectId,
      removeAll: true,
    });
  };

  deleteFreeBonusGemSlot = ({ errorMsg = MessagesErrorConstants.JOIN_TO_PROJECT_GEM_NOT_EXISTS } = {}) => {
    const { popupData: { projectId } = {}, deleteFreeBonusSlotFromPreview, deleteFreeBonusSlot } = this.props;

    this.setState({ participantUseGem: false });

    this.setInputError('participantUseGem', errorMsg);

    deleteFreeBonusSlotFromPreview({
      type: LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
      projectId,
      removeAll: true,
    });
    deleteFreeBonusSlot({
      type: LateEntrySlotTypesConstants.GEM_CONTRIBUTOR,
      projectId,
      removeAll: true,
    });
  };

  computedTotalKoins = () => {
    const { cutsCount = 0 } = this.state;

    const { priceCut = 0 } = this.getProjectInfo();

    return priceCut * cutsCount || 0;
  };

  isUsedGem = () => {
    const { participantUseGem } = this.state;

    return this.isUseGem() && participantUseGem;
  };

  isUseGem = () => {
    const {
      popupData: { isUseGem } = {},
      variablesList: { CONTRIBUTE_PROJECT_USE_GEM_ALLOWED } = {},
      userInfo: { goldenCoinsCount, gemsCount = 0 } = {},
    } = this.props;

    return (
      isUseBuyGemUtil({
        gemsCount,
        freeBonusesGoldenCoinSlotsCount: this.freeBonusesGoldenCoinSlotsCount(),
        goldenCoinsCount,
        freeBonusesGemSlotsCount: this.freeBonusesGemSlotsCount(),
        CONTRIBUTE_PROJECT_USE_GEM_ALLOWED,
      }) || isUseGem
    );
  };

  isUseGoldenCoin = () => {
    const { popupData: { isUseGoldenCoin } = {}, userInfo: { goldenCoinsCount } = {} } = this.props;

    return (
      isUseBuyGoldenCoinUtil({
        goldenCoinsCount,
        freeBonusesGoldenCoinSlotsCount: this.freeBonusesGoldenCoinSlotsCount(),
      }) || isUseGoldenCoin
    );
  };

  freeBonusesGemSlotsCount = () => {
    const { popupData: { freeBonusesGemSlotsCount = 0 } = {} } = this.props;

    const { freeBonuses: { slots: freeBonusesSlots = [] } = {} } = this.getProjectInfo();

    return (
      getFreeBonusesGemSlotsUtil({
        freeBonusesSlots: this.isLateEntryStatus() ? this.getLateEntrySlots() : freeBonusesSlots,
      }).length || freeBonusesGemSlotsCount
    );
  };

  freeBonusesGoldenCoinSlotsCount = () => {
    const { popupData: { freeBonusesGoldenCoinSlotsCount = 0 } = {} } = this.props;

    const { freeBonuses: { slots: freeBonusesSlots = [] } = {} } = this.getProjectInfo();

    return (
      getFreeBonusesGoldenCoinSlotsUtil({
        freeBonusesSlots: this.isLateEntryStatus() ? this.getLateEntrySlots() : freeBonusesSlots,
      }).length || freeBonusesGoldenCoinSlotsCount
    );
  };

  isParticipationContributor = () => {
    const { popupData: { participationContributor: initialParticipationContributor } = {} } = this.props;

    const { requestedUserInfo } = this.getProjectInfo();

    return initialParticipationContributor || projectParticipationInfoUtil(requestedUserInfo);
  };

  getLateEntrySlots = () => {
    const { popupData: { lateEntrySlots } = {} } = this.props;

    const { lateEntryInfo: { slots = lateEntrySlots } = {} } = this.getProjectInfo();

    return slots;
  };

  renderPopupContent = () => {
    const { variablesList: { GOLDEN_COIN_PROJECT_PERCENTAGE, CONTRIBUTE_PROJECT_GEM_VALUE_PERCENTAGE } = {} } = this.props;

    const { participantUseGem, participantUseGemError, participantUseGemErrorMsg } = this.state;

    const { priceCut = 0 } = this.getProjectInfo();

    const { percent: lateEntryGemPercent = 0 } =
      this.getLateEntrySlots().find(({ type }) => type === LateEntrySlotTypesConstants.GEM_CONTRIBUTOR) || {};
    const { percent: lateEntryGoldenCoinPercent = 0 } =
      this.getLateEntrySlots().find(({ type }) => type === LateEntrySlotTypesConstants.GOLDEN_COIN) || {};

    if (!this.isParticipationContributor() && this.isLateEntryStatus() && (this.isUseGoldenCoin() || this.isUseGem())) {
      return (
        <>
          {this.isUseGem() && (
            <>
              <GemIcon size={32} className="m-top-20" />
              <p className="w-315_max m-top-25 m-bottom-15">
                Use a&nbsp;Gem to&nbsp;get late access to&nbsp;completed projects and{' '}
                <b>
                  get {lateEntryGemPercent}
                  &nbsp;
                  {textForLotsOfUtil(lateEntryGemPercent, ['cut', 'cuts'])} for free
                </b>
              </p>
            </>
          )}
          {this.isUseGoldenCoin() && (
            <>
              <GoldenCoinIcon size={32} className="m-top-20" />
              <p className="w-315_max m-top-25 m-bottom-15">
                Use a&nbsp;Golden Koin to&nbsp;get late access to&nbsp;completed projects and{' '}
                <b>
                  get {lateEntryGoldenCoinPercent}
                  &nbsp;
                  {textForLotsOfUtil(lateEntryGoldenCoinPercent, ['cut', 'cuts'])} for free
                </b>
              </p>
            </>
          )}
        </>
      );
    }

    if (!this.isUseGoldenCoin()) {
      return (
        <>
          <div className="m-top-30 m-bottom-5 w-100pct">
            <div className={styles.MultiCutPopup__multiCutInfo}>
              Total:
              <div className={classNames('f-y-center', styles.MultiCutPopup__value)}>
                {this.isUsedGem() && (
                  <span className={classNames('c-gray-3 m-right-10', globalStyles.lineThrough)}>
                    <b>
                      <Coin size={16} color="gray-3" afterText={floatWithCommaFixedUtil(this.computedTotalKoins())} />
                    </b>
                  </span>
                )}
                <b className={classNames([this.isUsedGem() && 'c-gem'])}>
                  <Coin
                    size={16}
                    colorUrl={this.isUsedGem() ? 'gem-gradient' : undefined}
                    afterText={floatWithCommaFixedUtil(
                      Math.max(
                        this.computedTotalKoins() - (this.isUsedGem() ? CONTRIBUTE_PROJECT_GEM_VALUE_PERCENTAGE * priceCut : 0),
                        0
                      )
                    )}
                  />
                </b>
              </div>
            </div>
          </div>
          {this.isUseGem() && (
            <>
              <ErrorInputMessage
                className={styles.MultiCutPopup__participantUseGemError}
                invalid={participantUseGemError}
                invalidMessage={participantUseGemErrorMsg}
              />
              <CreateProjectBonusCheckbox
                type="GEM"
                id="participantUseGem"
                checked={participantUseGem}
                text={`Use Gem for ${CONTRIBUTE_PROJECT_GEM_VALUE_PERCENTAGE}%`}
                withDescription={false}
                iconSize={32}
                disabled={participantUseGemError}
                onChange={(e) => {
                  this.changeCheckBoxHandler(e);

                  if (!participantUseGemError) {
                    return;
                  }

                  this.setState({
                    participantUseGemError: false,
                    participantUseGemErrorMsg: '',
                  });
                }}
              />
            </>
          )}
        </>
      );
    }

    return (
      <>
        <p className="m-top-25 w-295_max">
          Use a&nbsp;Golden&nbsp;Koin to&nbsp;join any project for free and become the owner&nbsp;of
        </p>
        <p className="m-top-10 c-golden-coin t-medium_italic text_size_20">
          {GOLDEN_COIN_PROJECT_PERCENTAGE} {textForLotsOfUtil(GOLDEN_COIN_PROJECT_PERCENTAGE, ['cut', 'cuts'])}
        </p>
        <p className="m-top-10 m-bottom-10 w-280_max">
          Your Golden&nbsp;Koin will be&nbsp;returned if&nbsp;the project does not complete
        </p>
      </>
    );
  };

  render() {
    const { popupId = PopupProjectIdsConstants.MultiCutPopup, closePopup, buyCutInProcess } = this.props;

    return (
      <Popup
        popupId={popupId}
        headerText={this.isLateEntryStatus() ? 'Get late access to&nbsp;completed projects' : CommonMessagesConstants.PREORDER}
        maxWidth={425}
        classCustom={styles.MultiCutPopup}
        popupInClassName={styles.popupIn}
        popupContentClassName={styles.popupContent}
      >
        {this.renderPopupContent()}
        <PopupActionButton
          popupId={popupId}
          closePopup={closePopup}
          okButtonText={CommonMessagesConstants.PAY_NOW}
          okButtonInProcess={buyCutInProcess}
          okButtonDisables={this.disabledButCutButton()}
          okButtonOnClick={this.onBuyMultiCut}
          className={styles.popupDoubleButtons}
        />
        {!this.isLateEntryStatus() &&
          (!this.isUseGoldenCoin() ? (
            <div className="c-gray-2 m-top-15">
              <h5>If&nbsp;the project is&nbsp;not funded, it&nbsp;will be&nbsp;closed and refund will be&nbsp;issued</h5>
            </div>
          ) : (
            <div className="golden-icon-bg">
              <GoldenCoinIconBigShadow />
            </div>
          ))}
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    buyCutInProcess: state.ProjectCardReducer.buyCutInProcess,
    projectCards: state.ProjectCardReducer.projectCards,
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    userInfo: state.AuthReducer.userInfo,
  }),
  (dispatch) => ({
    deleteFreeBonusSlotFromPreview: (params) => {
      dispatch(deleteFreeBonusSlotFromPreviewAction(params));
    },
    deleteFreeBonusSlot: (params) => {
      dispatch(deleteProjectCardFreeBonusSlotAction(params));
    },
    buyCutRequest: (params) => buyCutRequestAction({ ...params, dispatch }),
  })
)(MultiCutPopup);
