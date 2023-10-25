import { Component, createRef } from 'react';

import { Collapse } from 'react-collapse';
import { connect } from 'react-redux';

import Timer from '@/components/common/Timer';
import CodeArrowDecorations from '@/components/ConfirmPhoneNumber/_components/steps/CodeArrowDecorations';
import PopupHeader from '@/components/primary/Popup/_components/PopupHeader';
import Button from '@/components/ui/buttons/Button';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import ConfirmPhoneTypesConstants from '@/constants/confirm/phone/type';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { sendConfirmPhoneCodeRequestAction } from '@/redux-actions/confirm/confirmPhoneActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeInputHandler } from '@/utils/inputHandlersUtil';

import styles from './styles.module.scss';

const TEXT = (
  <>
    To&nbsp;confirm your phone number, enter&nbsp;the&nbsp;
    <b>last&nbsp;4&nbsp;digits</b> of&nbsp;the number that just called you. You don&rsquo;t need to&nbsp;pick up&nbsp;the call.
  </>
);

class SmsCode extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);

    this.codeChar1Ref = createRef();
    this.codeChar2Ref = createRef();
    this.codeChar3Ref = createRef();
    this.codeChar4Ref = createRef();

    const { notFastLeft, variablesList: { CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS } = {} } = props;

    this.state = {
      codeChar1: '',
      codeChar2: '',
      codeChar3: '',
      codeChar4: '',
      codeError: false,
      codeErrorMsg: '',

      endDate: new Date().valueOf() + (notFastLeft > 0 ? notFastLeft : CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000),
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', this.keyupEventListener, false);
    this.codeChar1Ref.current.addEventListener('paste', this.pastEventListener, false);
    this.codeChar1Ref.current.focus();
  }

  componentDidUpdate(prevProps) {
    const { notFastLeft, canGetCodeAgain } = this.props;
    const { notFastLeft: notFastLeftPrev, canGetCodeAgain: canGetCodeAgainPrev } = prevProps;

    if (notFastLeft !== notFastLeftPrev) {
      this.updateEndDate();
    }

    if (canGetCodeAgain !== canGetCodeAgainPrev && !canGetCodeAgain) {
      this.updateEndDate();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.keyupEventListener, false);
    this.codeChar1Ref.current.removeEventListener('paste', this.pastEventListener, false);
  }

  keyupEventListener = ({ target: { id } = {}, keyCode }) => {
    switch (keyCode) {
      case 8: {
        this.setFocusPrev(id);
        break;
      }
      case 37: {
        this.setFocusPrev(id);
        break;
      }
      case 39: {
        this.setFocusNext(id);
        break;
      }
      default:
        break;
    }
  };

  pastEventListener = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');

    if (pastedData.length > 0 && parseInt(pastedData, 10) >= 0) {
      if (pastedData.length > 3) {
        this.sendCode({ pastedData });
      }

      this[`codeChar${pastedData.length < 4 ? pastedData.length + 1 : 4}Ref`]?.current?.focus();
    }
  };

  setFocusPrev = (id) => {
    const prevId = +id.substr(id.length - 1) - 1;
    this[`codeChar${prevId >= 1 ? prevId : 1}Ref`]?.current?.focus();
  };

  setFocusNext = (id) => {
    const nextId = +id.substr(id.length - 1) + 1;
    this[`codeChar${nextId <= 4 ? nextId : 4}Ref`]?.current?.focus();
  };

  setValueNext = (id, value) => {
    const { codeChar1, codeChar2, codeChar3, codeChar4 } = this.state;

    if (value.length < 2) {
      return;
    }

    const newValueNext = value.substr(value.length - 1);
    const curId = +id.substr(id.length - 1);

    if (!newValueNext && newValueNext.length > 1) {
      return;
    }

    if (curId <= 1 && codeChar1 && !codeChar2) {
      this.setState(
        {
          codeChar2: newValueNext,
        },
        () => {
          this.codeChar3Ref.current.focus();
        }
      );
    }

    if (curId <= 2 && codeChar2 && !codeChar3) {
      this.setState(
        {
          codeChar3: newValueNext,
        },
        () => {
          this.codeChar4Ref.current.focus();
        }
      );
    }

    if (curId <= 3 && codeChar3 && !codeChar4) {
      this.setState(
        {
          codeChar4: newValueNext,
        },
        () => {
          this.codeChar4Ref.current.focus();
          this.sendCode();
        }
      );
    }
  };

  updateEndDate = () => {
    const { notFastLeft, variablesList: { CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS } = {} } = this.props;

    this.setState({
      endDate: new Date().valueOf() + (notFastLeft > 0 ? notFastLeft : CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS * 1000),
    });
  };

  sendCode = ({ pastedData = '' } = {}) => {
    if (pastedData.length > 0) {
      this.setState(
        {
          codeChar1: pastedData[0] || '',
          codeChar2: pastedData[1] || '',
          codeChar3: pastedData[2] || '',
          codeChar4: pastedData[3] || '',
          codeError: false,
          codeErrorMsg: '',
        },
        () => {
          const { codeChar1, codeChar2, codeChar3, codeChar4, codeError } = this.state;

          this.send({ codeChar1, codeChar2, codeChar3, codeChar4, codeError });
        }
      );
    } else {
      const { codeChar1, codeChar2, codeChar3, codeChar4, codeError } = this.state;

      this.send({ codeChar1, codeChar2, codeChar3, codeChar4, codeError });
    }
  };

  send = ({ codeChar1, codeChar2, codeChar3, codeChar4, codeError }) => {
    const {
      sendConfirmPhoneCodeRequest,
      sendConfirmPhoneCodeInProcess,
      showPhoneError,
      isGoldenConfirm,
      changeSuccess,
      isChange,
      showPopup,
    } = this.props;

    if (sendConfirmPhoneCodeInProcess || !codeChar1 || !codeChar2 || !codeChar3 || !codeChar4 || codeError) {
      return;
    }

    this.codeChar1Ref.current.focus();

    sendConfirmPhoneCodeRequest({
      code: `${codeChar1}${codeChar2}${codeChar3}${codeChar4}`,
    })
      .then(() => {
        changeSuccess({ isSuccess: true });

        if (isChange) {
          showPopup(PopupPersonalIdsConstants.PhoneNumberPopup, {
            isSuccess: true,
            isGoldenConfirm,
          });
        }
      })
      .catch(({ error = {} }) => {
        this.setState({
          codeChar1: '',
          codeChar2: '',
          codeChar3: '',
          codeChar4: '',
        });

        this.codeChar1Ref.current.focus();

        if (error) {
          handleErrorUtil(error, {
            PHONE_ALREADY_CONFIRMED: () => {
              showPhoneError('PHONE_ALREADY_CONFIRMED');
            },
            PHONE_ALREADY_EXISTS: () => {
              showPhoneError('PHONE_ALREADY_EXISTS');
            },
            CONFIRM_PHONE_CODE_INVALID: () => {
              this.setState({
                codeError: true,
                codeErrorMsg: CommonErrorMessages.CONFIRM_PHONE_CODE_INVALID,
              });
            },
          });
        }
      });
  };

  changePhone = () => {
    const { cancelConfirmPhoneCodeInProcess, cancelConfirmPhoneCodeRequest, isChange, showPopup } = this.props;

    if (cancelConfirmPhoneCodeInProcess) {
      return;
    }

    cancelConfirmPhoneCodeRequest({
      callback: isChange ? () => showPopup(PopupPersonalIdsConstants.PhoneNumberPopup) : undefined,
    });
  };

  disabledCallAgain = () => {
    const { canGetCodeAgain } = this.props;
    const { getConfirmPhoneCodeInProcess } = this.props;

    return getConfirmPhoneCodeInProcess || !canGetCodeAgain;
  };

  getCodeAgain = ({ type }) => {
    const { getConfirmPhoneCode } = this.props;

    if (this.disabledCallAgain()) {
      return;
    }

    this.codeChar1Ref.current.focus();

    getConfirmPhoneCode({ isFast: true, type });
  };

  render() {
    const {
      notFastLeft,
      isChange,
      withTitle,
      canGetCodeAgain,
      changeCanGetCodeAgain,
      changeNotFastLeft,
      cancelConfirmPhoneCodeInProcess,
      popupHeaderClassName,
    } = this.props;

    const { codeChar1, codeChar2, codeChar3, codeChar4, codeError, codeErrorMsg, endDate } = this.state;

    return (
      <>
        {withTitle && (
          <PopupHeader className={popupHeaderClassName} withClose={false}>
            Confirm your number
          </PopupHeader>
        )}
        <div className="content-text m-bottom-25 w-340_max t-center">
          {!isChange ? TEXT : <div className="m-top-20">{TEXT}</div>}
        </div>
        <div className="confirm-phone__example m-bottom-30">
          <span className="title_l">
            +1 *** *** <b>XXXX</b>
            <CodeArrowDecorations />
          </span>
        </div>
        <div className={styles.inputBlockNumberSplit}>
          <Input
            ref={this.codeChar1Ref}
            id="codeChar1"
            type="number"
            value={codeChar1}
            onChange={(e) => {
              this.setState({
                codeError: false,
              });

              if (e.target.value.length > 0) {
                this.setValueNext(e.target.id, e.target.value);
                this.codeChar2Ref.current.focus();
              }

              if (e.target.value.length <= 1) {
                this.changeInputHandler(e);
              }
            }}
            invalid={codeError}
            autoFocus={!isChange}
          />
          <Input
            ref={this.codeChar2Ref}
            id="codeChar2"
            type="number"
            value={codeChar2}
            onChange={(e) => {
              this.setState({
                codeError: false,
              });

              if (e.target.value.length > 0) {
                this.setValueNext(e.target.id, e.target.value);
                this.codeChar3Ref.current.focus();
              }

              if (e.target.value.length <= 1) {
                this.changeInputHandler(e);
              }
            }}
            invalid={codeError}
          />
          <Input
            ref={this.codeChar3Ref}
            id="codeChar3"
            type="number"
            value={codeChar3}
            onChange={(e) => {
              this.setState({
                codeError: false,
              });

              if (e.target.value.length > 0) {
                this.setValueNext(e.target.id, e.target.value);
                this.codeChar4Ref.current.focus();
              }

              if (e.target.value.length <= 1) {
                this.changeInputHandler(e);
              }
            }}
            invalid={codeError}
          />
          <Input
            ref={this.codeChar4Ref}
            id="codeChar4"
            type="number"
            value={codeChar4}
            onChange={(e) => {
              this.setState({
                codeError: false,
              });

              if (e.target.value.length <= 1) {
                this.changeInputHandler(e, { onChangeCallback: this.sendCode });
              }
            }}
            invalid={codeError}
          />
        </div>
        <ErrorInputMessage className="t-center" invalidMessage={codeErrorMsg} invalid={codeError} />
        <div className="m-top-20 t-center">
          <div>
            <span className="t-size_12">Didn&apos;t receive the call?</span>
          </div>
          <Button
            type="button_string"
            className="c-blue t-bold"
            text="Call me again"
            onClick={() => this.getCodeAgain({ type: ConfirmPhoneTypesConstants.FLASHCALL })}
            disabled={this.disabledCallAgain()}
          />
          <div>or</div>
          <Button
            type="button_string"
            className="c-blue t-bold"
            text="Send SMS with the code"
            onClick={() => this.getCodeAgain({ type: ConfirmPhoneTypesConstants.SMS })}
            disabled={this.disabledCallAgain()}
          />
          <Collapse isOpened={!canGetCodeAgain || notFastLeft > 0}>
            <Timer
              className="c-gray-1"
              endDate={endDate}
              endDateCallback={() => {
                changeCanGetCodeAgain(true);
                changeNotFastLeft(0);
              }}
              formats={['minutes', 'seconds']}
            />
          </Collapse>
        </div>
        <div className="m-top-25 w-100pct f-x-between">
          <span>Wrong number?</span>
          <Button
            type="button_string"
            className="c-blue t-bold"
            text="Change number"
            disabled={cancelConfirmPhoneCodeInProcess}
            onClick={this.changePhone}
          />
        </div>
      </>
    );
  }
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    variablesList: state.VariablesReducer.variablesList,
    getConfirmPhoneCodeInProcess: state.ConfirmPhoneReducer.getConfirmPhoneCodeInProcess,
    sendConfirmPhoneCodeInProcess: state.ConfirmPhoneReducer.sendConfirmPhoneCodeInProcess,
  }),
  (dispatch) => ({
    sendConfirmPhoneCodeRequest: (params) => sendConfirmPhoneCodeRequestAction(params, dispatch),
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
  })
)(SmsCode);
