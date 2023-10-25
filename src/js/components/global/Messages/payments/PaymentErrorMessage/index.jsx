import { MessagesIdConstants } from '@/constants/messages/ids';
import { MessagesSuccessConstants } from '@/constants/messages/success';

import ErrorMessage from '../../common/ErrorMessage';

function PaymentErrorMessage() {
  return (
    <ErrorMessage
      messageId={MessagesIdConstants.PaymentSuccessMessage}
      messageData={{ messageText: MessagesSuccessConstants.PAYMENT_ERROR }}
    />
  );
}

export default PaymentErrorMessage;
