import { Component } from 'react';

import { connect } from 'react-redux';

import Popup from '@/components/primary/Popup';
import Button from '@/components/ui/buttons/Button';
import Input from '@/components/ui/inputs/Input';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { CommonMessagesConstants } from '@/constants/common/message';
import { CommonRegExpConstants } from '@/constants/common/regExp';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { projectInviteRequestAction } from '@/redux-actions/project/projectInviteActions';
import { handleErrorUtil } from '@/utils/apiUtils';
import { changeInputHandler, pressEnterKeyInputHandler, setInputError, validateField } from '@/utils/inputHandlersUtil';
import { ValidateMaxLengthUtil, ValidateRegularTestUtil } from '@/utils/validate/inputCheckValidate';

class ProjectInvitePopup extends Component {
  constructor(props) {
    super(props);

    this.changeInputHandler = changeInputHandler.bind(this);
    this.setInputError = setInputError.bind(this);
    this.validateField = validateField.bind(this);

    this.state = {
      email: '',
      emailError: false,
      emailErrorMsg: '',
    };
  }

  disabledInviteButton = () => {
    const { projectInviteInProcess } = this.props;
    const { email, emailError } = this.state;

    return (
      projectInviteInProcess || !email || emailError || !ValidateRegularTestUtil(email, CommonRegExpConstants.EMAIL_VALIDATE)
    );
  };

  onInvite = () => {
    const {
      projectInviteRequest,
      popupData: { projectId } = {},

      closePopup,
      showMessage,
    } = this.props;

    const { email } = this.state;

    if (this.disabledInviteButton()) {
      return;
    }

    projectInviteRequest({ email, projectId })
      .then(() => {
        closePopup(PopupProjectIdsConstants.ProjectInvitePopup);

        showMessage('SuccessMessage', {
          messageText: `You have successfully sent invite to <span class="t-medium">${email}<b>`,
        });
      })
      .catch(({ error, payload: { errorField } = {} }) => {
        // closePopup(PopupProjectIdsConstants.ProjectInvitePopup);

        if (error) {
          handleErrorUtil(error, {
            BAD_REQUEST: () => {
              this.badRequest(errorField);
            },
            PROJECT_STATUS_WRONG: () => {
              closePopup(PopupProjectIdsConstants.ProjectInvitePopup);
            },
            USER_HAS_ALREADY_BEEN_INVITED: () => {
              this.setInputError('email', 'You have already invited this user');
            },
            INVITED_USER_IS_FOUNDER: () => {
              this.setInputError('email', 'You invite the founder');
            },
            INVITED_USER_IS_CONTRIBUTOR: () => {
              this.setInputError('email', 'You invite the contributor');
            },
            INVITE_YOURSELF: () => {
              this.setInputError('email', 'You have sent an invite to yourself');
            },
            USER_IS_NOT_PROJECT_MEMBER: () => {
              closePopup(PopupProjectIdsConstants.ProjectInvitePopup);
              showMessage('ErrorMessage', {
                messageText: 'You are not a participant in the pre-order',
              });
            },
          });
        }
      });
  };

  render() {
    const { email, emailError, emailErrorMsg } = this.state;

    const { popupId = PopupProjectIdsConstants.ProjectInvitePopup, projectInviteInProcess } = this.props;

    return (
      <Popup popupId={popupId} headerText="Invite by email" maxWidth={425}>
        <Input
          id="email"
          label="Enter your frined email to invite"
          value={email}
          invalid={emailError}
          invalidMessage={emailErrorMsg}
          onChange={this.changeInputHandler}
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
          onKeyDown={(e) => pressEnterKeyInputHandler(e, this.onInvite)}
        />
        <Button
          text={CommonMessagesConstants.CONTINUE}
          className="w-100pct m-top-5"
          disabled={this.disabledInviteButton()}
          isInProcess={projectInviteInProcess}
          onClick={() => {
            this.onInvite();
          }}
        />
      </Popup>
    );
  }
}

export default connect(
  (state) => ({
    projectInviteInProcess: state.ProjectInviteReducer.projectInviteInProcess,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    projectInviteRequest: (params) => projectInviteRequestAction(params)(dispatch),
  })
)(ProjectInvitePopup);
