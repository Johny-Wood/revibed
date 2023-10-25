import classNames from 'classnames';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import styles from './styles.module.scss';

function ErrorInputMessageContent({ invalid, invalidMessage: InvalidMessage, className, children }) {
  return (
    <SwitchTransition>
      <CSSTransition
        key={invalid}
        timeout={{
          appear: 300,
          enter: 200,
          exit: 100,
        }}
        classNames={{
          enter: styles.inputErrorMsgAnimationEnter,
          enterActive: styles.inputErrorMsgAnimationEnter_active,
          exit: styles.inputErrorMsgAnimationExit,
          exitActive: styles.inputErrorMsgAnimationExit_active,
        }}
      >
        <div className={classNames(['error-msg', className])}>
          {invalid && <span className="error-msg__icon">⚠&nbsp;</span>}
          {typeof InvalidMessage === 'function' ? <InvalidMessage /> : InvalidMessage}
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}

export default ErrorInputMessageContent;
