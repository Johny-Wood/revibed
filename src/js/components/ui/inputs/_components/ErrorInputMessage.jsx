import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

const ErrorInputMessageContent = dynamic(() => import('@/components/ui/inputs/_components/ErrorInputMessageContent'), {
  ssr: false,
});

function ErrorInputMessage({ invalid, invalidMessage, className, children }) {
  return (
    <Collapse isOpened={invalid && !!invalidMessage}>
      <ErrorInputMessageContent className={className} invalidMessage={invalidMessage} invalid={invalid}>
        {children}
      </ErrorInputMessageContent>
    </Collapse>
  );
}

ErrorInputMessage.defaultProps = {
  invalid: false,
  className: '',
};

ErrorInputMessage.propTypes = {
  invalid: PropTypes.bool,
  className: PropTypes.string,
};

export default ErrorInputMessage;
