import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupPaymentsIdsConstants } from '@/constants/popups/id';

import InfoMessage from '../../common/InfoMessage';

function PayPalPaymentHeldMessage() {
  return (
    <InfoMessage
      messageId={PopupPaymentsIdsConstants.PayPalPaymentHeldMessage}
      messageData={{ messageText: MessagesErrorConstants.PAYMENT_HELD }}
    />
  );
}

export default PayPalPaymentHeldMessage;
