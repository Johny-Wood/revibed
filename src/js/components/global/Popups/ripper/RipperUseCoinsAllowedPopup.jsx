import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { PopupRipperIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';

import WarningPopup from '../common/WarningPopup';

function RipperUseCoinsAllowedPopup({
  popupId = PopupRipperIdsConstants.RipperUseCoinsAllowedPopup,

  closePopup,
}) {
  return (
    <WarningPopup popupId={popupId}>
      <PopupTextContent>
        You cannot use coins as&nbsp;you are a&nbsp;ripper. For details, please&nbsp;
        <LinkRoute
          text="contact admin"
          href={RoutePathsConstants.CONTACT_ADMIN}
          className="c-blue"
          onClick={() => {
            closePopup(popupId);
          }}
        />
        .
      </PopupTextContent>
    </WarningPopup>
  );
}

export default RipperUseCoinsAllowedPopup;
