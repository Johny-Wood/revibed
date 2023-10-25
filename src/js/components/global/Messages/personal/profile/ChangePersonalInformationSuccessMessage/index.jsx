import { MessagesIdConstants } from '@/constants/messages/ids';
import { MessagesSuccessConstants } from '@/constants/messages/success';

import SuccessMessage from '../../../common/SuccessMessage';

function ChangePersonalInformationSuccessMessage() {
  return (
    <SuccessMessage
      messageId={MessagesIdConstants.ChangePersonalInformationSuccessMessage}
      messageData={{
        messageText: MessagesSuccessConstants.CHANGE_PERSONAL_INFORMATION_SUCCESS,
      }}
    />
  );
}

export default ChangePersonalInformationSuccessMessage;
