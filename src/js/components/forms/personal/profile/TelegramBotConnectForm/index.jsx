import { Component, createRef } from 'react';

import copy from 'copy-to-clipboard';
import { connect } from 'react-redux';

import TelegramBotConnectIndication from '@/components/forms/personal/profile/_components/TelegramBotConnectIndication';
import ProfileFormLayout from '@/components/layouts/ProfileFormLayout';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import Button from '@/components/ui/buttons/Button';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import LinkDefault from '@/components/ui/links/LinkDefault';
import ComponentsCommonConstants from '@/constants/components/common';
import CopyIcon from '@/icons/CopyIcon';
import { showPopupAction } from '@/redux-actions/components/popupActions';
import { connectTgBotRequestAction } from '@/redux-actions/personal/personalActions';

import styles from './styles.module.scss';

class TelegramBotConnectForm extends Component {
  constructor(props) {
    super(props);

    this.telegramBotRef = createRef();
    this.copiedTimer = 0;

    this.state = {
      isCopied: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.copiedTimer);
  }

  render() {
    const {
      variablesList: { TELEGRAM_BOT_LINK } = {},

      userInfo: { tgActive = false } = {},

      connectTgBotInProcess,
      connectTgBotConfirmCode,

      connectTgBotRequest,
    } = this.props;

    const { isCopied } = this.state;

    return (
      <ProfileFormLayout ref={this.telegramBotRef} id="telegram-bot">
        <TelegramBotConnectIndication connected={tgActive} />
        {!tgActive && (
          <>
            <div className="m-top-30 w-100pct">
              <p>
                <LinkDefault className="c-blue t-bold" href={TELEGRAM_BOT_LINK} text="Click here" />
                &nbsp;to connect the bot and follow on-screen instructions
              </p>
            </div>
            <div className="m-top-30 w-100pct">
              <p className="m-bottom-15">To connect your account please generate a unique verification code</p>
              <div className={styles.telegramBotGenerate}>
                <Button
                  text="Generate code"
                  className={styles.telegramBotGenerate__buttonGenerate}
                  isInProcess={connectTgBotInProcess}
                  disabled={connectTgBotInProcess}
                  onClick={() => {
                    connectTgBotRequest();
                  }}
                />
                <TransitionLayout isShown={!!connectTgBotConfirmCode}>
                  <div className={styles.telegramBotGenerate__code}>{connectTgBotConfirmCode}</div>
                  <ButtonIcon
                    type="button_string"
                    className={styles.telegramBotGenerate__buttonCopy}
                    size={ComponentsCommonConstants.Size.NORMAL}
                    onClick={() => {
                      clearTimeout(this.copiedTimer);

                      this.setState({
                        isCopied: true,
                      });

                      this.copiedTimer = setTimeout(() => {
                        this.setState({
                          isCopied: false,
                        });
                      }, 5000);

                      copy(connectTgBotConfirmCode);
                    }}
                    tooltip={{
                      canShow: true,
                      hover: true,
                      text: isCopied ? 'Copied' : 'Copy code',
                      smallPadding: true,
                      closeCallback: () => {
                        this.setState({
                          isCopied: false,
                        });
                      },
                    }}
                  >
                    <CopyIcon />
                  </ButtonIcon>
                </TransitionLayout>
              </div>
            </div>
          </>
        )}
      </ProfileFormLayout>
    );
  }
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,

    userInfo: state.AuthReducer.userInfo,

    connectTgBotInProcess: state.PersonalReducer.connectTgBotInProcess,
    connectTgBotConfirmCode: state.PersonalReducer.connectTgBotConfirmCode,
  }),
  (dispatch) => ({
    showPopup: (popupId, popupData = {}, closeOtherPopups = true) => {
      dispatch(showPopupAction(popupId, popupData, closeOtherPopups));
    },
    connectTgBotRequest: () => {
      dispatch(connectTgBotRequestAction());
    },
  })
)(TelegramBotConnectForm);
