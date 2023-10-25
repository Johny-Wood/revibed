import { Component } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import AgreeTermsOfUseCheckBox from '@/components/common-ui/check-boxes/AgreeTermsOfUseCheckBox';
import DateFormatDDMMYYYY from '@/components/common/date/DateFormatDDMMYYYY';
import Popup from '@/components/primary/Popup';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import { CommonMessagesConstants } from '@/constants/common/message';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PopupProjectIdsConstants, PopupWantListIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { changePlanWantListRequestAction } from '@/redux-actions/wantList/wantListActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeCheckBoxHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

class ChangePlanWantListPopup extends Component {
  constructor(props) {
    super(props);

    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);

    this.state = {
      changePlanAgree: false,
      changePlanAgreeError: false,
      changePlanAgreeErrorMsg: '',
    };
  }

  disabledChange = () => {
    const { changePlanWantListInProcess } = this.props;
    const { changePlanAgree } = this.state;

    return changePlanWantListInProcess || !changePlanAgree;
  };

  render() {
    const {
      popupId = PopupWantListIdsConstants.ChangePlanWantListPopup,
      popupData: {
        selectedPlanNew: {
          selectedPlanId,
          selectedPlanName,
          selectedPlanSum,
          selectedPlanDescription,
          selectedActivationStartDate,
        } = {},
        selectedPlanNew = {},
      } = {},

      closePopup,
      showMessage,
      showPopup,

      changePlanWantListRequest,
      changePlanWantListInProcess,
    } = this.props;

    const { changePlanAgree, changePlanAgreeError, changePlanAgreeErrorMsg } = this.state;

    return (
      <Popup
        popupId={popupId}
        headerText="Change your Plan"
        textAlign="left"
        maxWidth={450}
        classCustom={styles.ChangePlanWantListPopup}
      >
        <div className={classNames(styles.wantListPlanChangeInfo, 'm-bottom-20 m-top-25')}>
          <div className={classNames(styles.wantListPlanChangeInfo__item, 'c-black-exactly')}>
            <div className={styles.wantListPlanChangeInfo__description}>
              <span className="t-semi-bold">{selectedPlanName}</span>
              <div>{selectedPlanDescription}</div>
            </div>
            <div className={styles.wantListPlanChangeInfo__description}>
              <div className="f-y-center">
                <Coin size={14}>
                  <span className="t-semi-bold">{selectedPlanSum}</span>
                </Coin>
                <span className="c-gray-2 title_xs">&nbsp;/month</span>
              </div>
              <div className={styles.wantListPlanChangeInfo__date}>
                <i>
                  charge{' '}
                  {selectedActivationStartDate ? (
                    <DateFormatDDMMYYYY date={selectedActivationStartDate} />
                  ) : (
                    CommonMessagesConstants.NOW
                  )}
                </i>
              </div>
            </div>
          </div>
        </div>
        <div className="m-bottom-5 title_xs">
          Your current plan will be&nbsp;extended automatically. Previous subscriptions will be&nbsp;active untill expiration
          date.
        </div>
        <AgreeTermsOfUseCheckBox
          id="changePlanAgree"
          checked={changePlanAgree}
          error={changePlanAgreeError}
          errorMsg={changePlanAgreeErrorMsg}
          onChange={this.changeCheckBoxHandler}
          anchor="wantlist"
        />
        <Button
          className="w-100pct"
          text="Change Plan"
          isInProcess={changePlanWantListInProcess}
          disabled={this.disabledChange()}
          onClick={() => {
            if (this.disabledChange()) {
              return;
            }

            changePlanWantListRequest(selectedPlanId, { selectedPlanNew })
              .then(() => {
                closePopup(popupId);
                showMessage('SuccessMessage', {
                  messageText: MessagesSuccessConstants.WANT_LIST_CHANGE_PLAN,
                });
              })
              .catch(({ error = {} }) => {
                closePopup(popupId);

                if (error) {
                  handleErrorUtil(error, {
                    INSUFFICIENT_FUNDS: () => {
                      showPopup(PopupProjectIdsConstants.InsufficientFundsPopup);
                    },
                    NOT_FOUND: () => {
                      showMessage('ErrorMessage', {
                        messageText: 'No plan found',
                      });
                    },
                  });
                }
              });
          }}
        />
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    changePlanWantListInProcess: state.WantListReducer.changePlanWantListInProcess,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    changePlanWantListRequest: (planId, data) => changePlanWantListRequestAction(planId, data)(dispatch),
  })
)(ChangePlanWantListPopup);
