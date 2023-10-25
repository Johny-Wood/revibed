import { MessagesIdConstants } from '@/constants/messages/ids';
import { MessagesSuccessConstants } from '@/constants/messages/success';

import SuccessMessage from '../../common/SuccessMessage';

function PaymentSuccessMessage() {
  return (
    <SuccessMessage
      messageId={MessagesIdConstants.PaymentSuccessMessage}
      messageData={{ messageText: MessagesSuccessConstants.PAYMENT_SUCCESS }}
    />
  );
}

export default PaymentSuccessMessage;
