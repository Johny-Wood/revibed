import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonErrorMessages } from '@/constants/common/errorsMessage';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupPersonalIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';

import WarningPopup from '../../common/WarningPopup';

function BannedUserPopup({
  popupId = PopupPersonalIdsConstants.BannedUserPopup,

  closePopup,
}) {
  return (
    <WarningPopup popupId={popupId} popupTitle={MessagesErrorConstants.USER_BANNED_TITLE}>
      <PopupTextContent>
        {CommonErrorMessages.USER_BANNED}
        .&nbsp;
        <LinkRoute
          href={RoutePathsConstants.CONTACT_US}
          translateKey="contactUs"
          className="underline"
          onClick={() => {
            closePopup(popupId);
          }}
        />
      </PopupTextContent>
    </WarningPopup>
  );
}

export default BannedUserPopup;
