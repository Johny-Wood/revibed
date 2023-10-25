import { Component, memo } from 'react';

import classNames from 'classnames';
import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import AgreeTermsOfUseCheckBox from '@/components/common-ui/check-boxes/AgreeTermsOfUseCheckBox';
import PriceAttitude from '@/components/common/PriceAttitude';
import FormLayout from '@/components/forms/_components/FormLayout';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import CheckBox from '@/components/ui/inputs/CheckBox';
import Input from '@/components/ui/inputs/Input';
import ToolTip from '@/components/ui/ToolTip';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { updateUserInfoAction } from '@/redux-actions/auth/authActions';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { getWithdrawInfoRequestAction, withdrawRequestAction } from '@/redux-actions/personal/withdrawActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import {
  changeCheckBoxHandler,
  changeInputHandler,
  pressEnterKeyInputHandler,
  setInputError,
  validateField,
} from '@/utils/inputHandlersUtil';
import { floatWithCommaFixedUtil, textForLotsOfUtil } from '@/utils/textUtils';
import {
  ValidateBadRequestUtil,
  ValidateMaxLengthUtil,
  ValidateMaxValueUtil,
  ValidateMinValueUtil,
  ValidateRegularTestUtil,
} from '@/utils/validate/inputCheckValidate';

import styles from './styles.module.scss';

const WithdrawalRules = memo(() => (
  <span className={classNames('c-blue t-medium', globalStyles.underlineDashed)}>Withdrawal rules</span>
));

WithdrawalRules.displayName = 'WithdrawalRules';

class WithdrawForm extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.changeCheckBoxHandler = changeCheckBoxHandler.bind(this);
    this.validateField = validateField.bind(this);
    this.setInputError = setInputError.bind(this);
    this.badRequest = ValidateBadRequestUtil.bind(this);

    const { userInfo: { createWithdrawAllowed, payPalAccount = '' } = {} } = props;

    this.state = {
      createWithdrawAllowed: createWithdrawAllowed || false,
      formDisabledErrorMsg: 'Exceeded limit on requests',

      payPalAccount: payPalAccount || '',
      payPalAccountError: false,
      payPalAccountErrorMsg: '',

      saveAccount: true,

      withdrawalAmount: '',
      withdrawalAmountError: false,
      withdrawalAmountErrorMsg: '',

      policyAgree: false,
      policyAgreeError: false,
      policyAgreeErrorMsg: '',
    };
  }

  componentDidMount() {
    const { createWithdrawAllowed } = this.state;

    if (!createWithdrawAllowed) {
      this.withdrawMaxCountOfActive();
    }
  }

  disabledPlaceRequest = () => {
    const {
      payPalAccount,
      payPalAccountError,

      withdrawalAmount,
      withdrawalAmountError,

      policyAgree,

      createWithdrawAllowed,
    } = this.state;

    const {
      withdrawInProcess,
      variablesList: { WITHDRAW_MINIMAL_FUNDS: withdrawalAmountMin, WITHDRAW_MAXIMAL_FUNDS: withdrawalAmountMax } = {},
    } = this.props;

    return (
      !createWithdrawAllowed ||
      withdrawInProcess ||
      !policyAgree ||
      !payPalAccount ||
      !withdrawalAmount ||
      +withdrawalAmount <= 0 ||
      payPalAccountError ||
      withdrawalAmountError ||
      !ValidateRegularTestUtil(payPalAccount, CommonRegExpConstants.EMAIL_VALIDATE) ||
      !ValidateMaxLengthUtil(payPalAccount, CommonErrorMessages.EMAIL_MAX_LENGTH) ||
      (withdrawalAmountMin && !ValidateMinValueUtil(withdrawalAmount, withdrawalAmountMin)) ||
      (withdrawalAmountMax && !ValidateMaxValueUtil(withdrawalAmount, withdrawalAmountMax))
    );
  };

  withdrawMaxCountOfActive = () => {
    const { showMessage } = this.props;

    showMessage('ErrorMessage', {
      messageText: 'The maximum number of active orders has been exceeded',
    });

    this.setState({
      createWithdrawAllowed: false,
      formDisabledErrorMsg: 'Exceeded limit on requests',
    });
  };

  onPlaceRequest = () => {
    const {
      withdrawRequest,
      showMessage,
      updateUserInfo,
      variablesList: { WITHDRAW_MINIMAL_FUNDS: withdrawalAmountMin, WITHDRAW_MAXIMAL_FUNDS: withdrawalAmountMax } = {},
    } = this.props;

    const { payPalAccount, withdrawalAmount, saveAccount, createWithdrawAllowed } = this.state;

    if (this.disabledPlaceRequest()) {
      return;
    }

    withdrawRequest({
      payPalAccount,
      withdrawalAmount,
      saveAccount,
    })
      .then(() => {
        showMessage('SuccessMessage', {
          messageText: 'Success! Your withdrawal request was accepted. We&nbsp;will review it&nbsp;within 24&nbsp;hours',
        });

        updateUserInfo({ payPalAccount });

        this.setState({
          withdrawalAmount: '',
          paidAmount: 0,
          policyAgree: false,
        });
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            INSUFFICIENT_FUNDS: () => {
              this.setInputError('withdrawalAmount', CommonErrorMessages.INSUFFICIENT_FUNDS);
            },
            WITHDRAW_MAX_COUNT_OF_ACTIVE: () => {
              this.withdrawMaxCountOfActive();

              updateUserInfo({ createWithdrawAllowed });
            },
            WITHDRAW_MINIMAL_NOT_MATCH: () => {
              this.setInputError('withdrawalAmount', `${CommonErrorMessages.MIN_VALUE}${withdrawalAmountMin}`);
            },
            WITHDRAW_MAXIMAL_NOT_MATCH: () => {
              this.setInputError('withdrawalAmount', `${CommonErrorMessages.MAX_VALUE}${withdrawalAmountMax}`);
            },
          });
        }
      });
  };

  onGetWithdrawInfo = (amount) => {
    const { getWithdrawInfoRequest } = this.props;

    const { withdrawalAmount } = this.state;

    if (+withdrawalAmount) {
      getWithdrawInfoRequest({ amount }).then(({ paidAmount }) => {
        this.setState({
          paidAmount,
        });
      });
    }
  };

  renderWithdrawLimitionText = () => {
    const { variablesList: { WITHDRAW_MINIMAL_FUNDS: withdrawalAmountMin, WITHDRAW_MAXIMAL_FUNDS: withdrawalAmountMax } = {} } =
      this.props;

    const withdrawalAmountOnlyText = (limitType) => `The ${limitType} number of coins for withdrawal is`;

    const withdrawalAmountMinOnlyText = (afterText = '') => (
      <>
        {withdrawalAmountOnlyText('minimum')}
        &nbsp;
        <Coin afterText={afterText}>{withdrawalAmountMin}</Coin>
      </>
    );

    const withdrawalAmountMaxOnlyText = (afterText = '') => (
      <>
        {withdrawalAmountOnlyText('maximum')}
        &nbsp;
        <Coin afterText={afterText}>{withdrawalAmountMax}</Coin>
      </>
    );

    const withdrawalAmountMaxNotOnlyText = () => (
      <>
        , the maximum is&nbsp;
        <Coin afterText=".&nbsp;">{withdrawalAmountMax}</Coin>
      </>
    );

    if (!!withdrawalAmountMin && !!withdrawalAmountMax) {
      return (
        <>
          {withdrawalAmountMinOnlyText()}
          {withdrawalAmountMaxNotOnlyText()}
        </>
      );
    }

    if (withdrawalAmountMin) {
      return <>{withdrawalAmountMinOnlyText('.&nbsp;')}</>;
    }

    if (withdrawalAmountMax) {
      return <>{withdrawalAmountMaxOnlyText('.&nbsp;')}</>;
    }

    return null;
  };

  render() {
    const {
      payPalAccount,
      payPalAccountError,
      payPalAccountErrorMsg,

      saveAccount,

      withdrawalAmount,
      withdrawalAmountError,
      withdrawalAmountErrorMsg,

      policyAgree,
      policyAgreeError,
      policyAgreeErrorMsg,

      createWithdrawAllowed,
      formDisabledErrorMsg,

      paidAmount,
    } = this.state;

    const {
      withdrawInProcess,
      variablesList: {
        WITHDRAW_MINIMAL_FUNDS: withdrawalAmountMin,
        WITHDRAW_MAXIMAL_FUNDS: withdrawalAmountMax,
        WITHDRAW_PLATFORM_COMMISSION_PERCENTAGE: withdrawalCommissionPercentage = 0,
        MAX_WITHDRAW_COUNT_OF_ACTIVE,
      } = {},
    } = this.props;

    return (
      <>
        <FormLayout className={classNames(!createWithdrawAllowed && styles.withdrawForm_disable)}>
          <div>Paypal account</div>
          <div className="inputs">
            <Input
              id="payPalAccount"
              label="Enter Email"
              value={payPalAccount}
              invalid={payPalAccountError}
              invalidMessage={payPalAccountErrorMsg}
              onChange={this.changeInputHandler}
              disabled={!createWithdrawAllowed}
              onBlur={(e) => {
                this.validateField(e, {
                  fieldIsValid: (value) => ValidateRegularTestUtil(value, CommonRegExpConstants.EMAIL_VALIDATE),
                  invalidMessage: CommonErrorMessages.EMAIL_PATTERN,
                  validateEmptyField: false,
                });

                this.validateField(e, {
                  fieldIsValid: (value) => ValidateMaxLengthUtil(value, CommonErrorMessages.EMAIL_MAX_LENGTH),
                  invalidMessage: CommonErrorMessages.EMAIL_MAX_LENGTH_ERROR,
                  validateEmptyField: false,
                });
              }}
              onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onPlaceRequest)}
            />
            <CheckBox
              id="saveAccount"
              checked={saveAccount}
              label="Save this account"
              onChange={this.changeCheckBoxHandler}
              disabled={!createWithdrawAllowed}
            />
          </div>
          <div>Enter amount to withdraw</div>
          <div className="inputs-column">
            <div className={styles.withdrawForm__input}>
              <Input
                id="withdrawalAmount"
                placeholder="0,00"
                value={withdrawalAmount}
                invalid={withdrawalAmountError}
                invalidMessage={withdrawalAmountErrorMsg}
                onChange={(e) => this.changeInputHandler(e, { onChangeCallback: this.onGetWithdrawInfo })}
                onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onPlaceRequest)}
                unit={<Coin size={14} />}
                min={withdrawalAmountMin}
                max={withdrawalAmountMax}
                fractionDigits={2}
                typeValue="float"
                disabled={!createWithdrawAllowed}
                onBlur={(e) => {
                  if (withdrawalAmountMin) {
                    this.validateField(e, {
                      fieldIsValid: (inputValue) => ValidateMinValueUtil(inputValue, withdrawalAmountMin),
                      invalidMessage: `${CommonErrorMessages.MIN_VALUE}${withdrawalAmountMin}`,
                      validateEmptyField: false,
                    });
                  }

                  if (withdrawalAmountMax) {
                    this.validateField(e, {
                      fieldIsValid: (inputValue) => ValidateMaxValueUtil(inputValue, withdrawalAmountMax),
                      invalidMessage: `${CommonErrorMessages.MAX_VALUE}${withdrawalAmountMax}`,
                      validateEmptyField: false,
                    });
                  }
                }}
              />
              {(withdrawalAmountMin || withdrawalAmountMax) && (
                <div className="text_size_12 f-y-center c-gray-2 m-left-15 m-top-25">
                  {withdrawalAmountMin && (
                    <Coin
                      color="gray-2"
                      className="m-left-10"
                      afterText={String(withdrawalAmountMin)}
                      beforeText="min: "
                      offset={false}
                    />
                  )}
                  {withdrawalAmountMax && (
                    <Coin
                      color="gray-2"
                      className="m-left-10"
                      afterText={String(withdrawalAmountMax)}
                      beforeText="max: "
                      offset={false}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="text_size_12 m-top-10">
              This amount will be&nbsp;debited minus&nbsp;
              {withdrawalCommissionPercentage}% commission fee
              <ToolTip borderRadius={false} button={WithdrawalRules} width={300}>
                <>
                  {this.renderWithdrawLimitionText()}
                  The limitation on&nbsp;the number of&nbsp;active applications is&nbsp;
                  {MAX_WITHDRAW_COUNT_OF_ACTIVE}
                  &nbsp;
                  {textForLotsOfUtil(MAX_WITHDRAW_COUNT_OF_ACTIVE, ['application', 'applications'])}
                  &nbsp;per day.
                </>
              </ToolTip>
            </div>
            <Collapse isOpened={withdrawalAmount && +withdrawalAmount > 0}>
              <div
                className={classNames(styles.withdrawForm__paidAmount, 'p-top-30 p-bottom-15')}
                style={{ opacity: withdrawalAmount ? 1 : 0 }}
              >
                <div className="m-bottom-5 f-y-center">
                  <p className={classNames(styles.withdrawForm__paidAmount__value, 't-semi-bold')}>
                    Total withdrawal: {floatWithCommaFixedUtil(paidAmount)}
                    &euro;*
                  </p>
                  <PriceAttitude className={styles.priceAttitude} />
                </div>
                <p className="text_size_12">* Excluding Paypal commission</p>
              </div>
            </Collapse>
            <AgreeTermsOfUseCheckBox
              id="policyAgree"
              checked={policyAgree}
              error={policyAgreeError}
              errorMsg={policyAgreeErrorMsg}
              onChange={this.changeCheckBoxHandler}
              disabled={!createWithdrawAllowed}
              anchor="exchanging-koins-and-withdrawin-funds-from-the-platform"
            />
          </div>
          <Button
            text="Place request"
            className="w-100pct"
            isInProcess={withdrawInProcess}
            disabled={this.disabledPlaceRequest()}
            onClick={() => this.onPlaceRequest()}
          />
        </FormLayout>
        <div className={styles.withdrawForm__formError}>
          <ErrorInputMessage invalid={!createWithdrawAllowed} invalidMessage={formDisabledErrorMsg} />
        </div>
      </>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
    withdrawInProcess: state.WithdrawReducer.withdrawInProcess,
    withdrawInfo: state.WithdrawReducer.withdrawInfo,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    updateUserInfo: (userInfo) => {
      dispatch(updateUserInfoAction(userInfo));
    },
    getWithdrawInfoRequest: ({ amount } = {}) => getWithdrawInfoRequestAction({ amount, dispatch }),
    withdrawRequest: ({ payPalAccount, withdrawalAmount, saveAccount }) =>
      withdrawRequestAction({ payPalAccount, withdrawalAmount, saveAccount, dispatch }),
  })
)(WithdrawForm);
