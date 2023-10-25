import PopupTextContent from '@/components/primary/Popup/_components/PopupTextContent';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { PopupProjectIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';

import WarningPopup from '../common/WarningPopup';

function CreateProjectsDisabledPopup({
  popupId = PopupProjectIdsConstants.CreateProjectsDisabledPopup,
  popupData: { typeAction = 'create' } = {},

  closePopup,
}) {
  return (
    <WarningPopup popupId={popupId} popupTitle="You are banned">
      <PopupTextContent>
        You cannot {typeAction} projects because you have been banned. In&nbsp;order to&nbsp;remove the ban, please&nbsp;
        <LinkRoute
          text="contact admin"
          href={RoutePathsConstants.CONTACT_ADMIN}
          className="c-blue"
          onClick={() => {
            closePopup(popupId);
          }}
        />
      </PopupTextContent>
    </WarningPopup>
  );
}

export default CreateProjectsDisabledPopup;
