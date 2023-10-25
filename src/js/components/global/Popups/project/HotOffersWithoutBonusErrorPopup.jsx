import parse from 'html-react-parser';

import TopUpGemsButton from '@/components/common-ui/buttons/TopUpGemsButton';
import { CommonMessagesConstants } from '@/constants/common/message';
import { MessagesErrorConstants } from '@/constants/messages/error';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import WarningPopup from '../common/WarningPopup';

function HotOffersWithoutBonusErrorPopup({ popupId = PopupProjectIdsConstants.HotOffersWithoutBonusErrorPopup }) {
  return (
    <WarningPopup
      popupId={popupId}
      popupData={{
        title: CommonMessagesConstants.OOPS,
      }}
      button={TopUpGemsButton}
    >
      <p>
        {parse(MessagesErrorConstants.HOT_OFFERS_BONUS_MESSAGE)}
        &nbsp;Learn more on&nbsp;how to&nbsp;earn gems .
      </p>
    </WarningPopup>
  );
}

export default HotOffersWithoutBonusErrorPopup;
