import { Component } from 'react';

import { connect } from 'react-redux';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import { closeMessageAction, showMessageAction } from '@/redux-actions/components/messageActions';

import ErrorMessage from './common/ErrorMessage';
import InfoMessage from './common/InfoMessage';
import SuccessMessage from './common/SuccessMessage';
import PaymentErrorMessage from './payments/PaymentErrorMessage';
import PaymentSuccessMessage from './payments/PaymentSuccessMessage';
import PayPalPaymentHeldMessage from './payments/PayPalPaymentHeldMessage';
import ChangePersonalInformationSuccessMessage from './personal/profile/ChangePersonalInformationSuccessMessage';
import ProjectNoAccessMessage from './project/ProjectNoAccessMessage';
import styles from './styles.module.scss';

const messagesComponents = () => ({
  InfoMessage: () => InfoMessage,
  SuccessMessage: () => SuccessMessage,
  ErrorMessage: () => ErrorMessage,
  PaymentSuccessMessage: () => PaymentSuccessMessage,
  PaymentErrorMessage: () => PaymentErrorMessage,
  PayPalPaymentHeldMessage: () => PayPalPaymentHeldMessage,
  ChangePersonalInformationSuccessMessage: () => ChangePersonalInformationSuccessMessage,
  ProjectNoAccessMessage: () => ProjectNoAccessMessage,
});

const messageComponentProps = {};

const createKey = (messageId, idx) => `message-key-${messageId}-${idx}`;

class Messages extends Component {
  renderActiveMessage = () => {
    const { activeMessageList, closeMessage, showMessage, variables } = this.props;

    if (activeMessageList.length === 0) {
      return null;
    }

    const { messageId, messageData } = activeMessageList[0];

    let messageComponentGeneratorProps = {};
    const messageComponentPropsArray = messageComponentProps[messageId] || [];

    messageComponentPropsArray.forEach((prop) => {
      const { props } = this;

      messageComponentGeneratorProps = {
        ...messageComponentGeneratorProps,
        [prop]: props[prop],
      };
    });

    const messageComponentGenerator = messagesComponents(messageComponentGeneratorProps)[messageId];

    if (!messageComponentGenerator) {
      return null;
    }

    const MessageComponent = messageComponentGenerator();

    if (!MessageComponent) {
      return null;
    }

    messageData.propsForBaseMessage = {
      ...messageData.propsForBaseMessage,
      closeMessage,
      showMessage,
    };

    return (
      <MessageComponent
        key={createKey(messageId, 0)}
        messageId={messageId}
        messageData={messageData}
        closeMessage={closeMessage}
        showMessage={showMessage}
        variables={variables}
      />
    );
  };

  render() {
    const { activeMessageList } = this.props;

    return (
      <TransitionSwitchLayout
        isShown={activeMessageList.length > 0}
        animationClassNames={{
          enter: styles.systemMessagesAnimationEnter,
          enterActive: styles.systemMessagesAnimationEnter_active,
          enterDone: styles.systemMessagesAnimationEnter_done,
          exit: styles.systemMessagesAnimationExit,
          exitActive: styles.systemMessagesAnimationExit_active,
        }}
      >
        {this.renderActiveMessage()}
      </TransitionSwitchLayout>
    );
  }
}

export default connect(
  (state) => ({
    activeMessageList: state.MessageReducer.activeMessageList,
    variables: state.VariablesReducer.variables,
  }),
  (dispatch) => ({
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
    closeMessage: (messageId) => {
      dispatch(closeMessageAction(messageId));
    },
  })
)(Messages);
