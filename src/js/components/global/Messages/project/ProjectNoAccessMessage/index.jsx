import { MessagesErrorConstants } from '@/constants/messages/error';
import { MessagesIdConstants } from '@/constants/messages/ids';

import ErrorMessage from '../../common/ErrorMessage';

function ProjectNoAccessMessage() {
  return (
    <ErrorMessage
      messageId={MessagesIdConstants.ProjectNoAccessMessage}
      messageData={{ messageText: MessagesErrorConstants.NO_ACCESS_PROJECT }}
    />
  );
}

export default ProjectNoAccessMessage;
