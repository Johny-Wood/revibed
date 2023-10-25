import Popup from '@/components/primary/Popup';
import ShareLinks from '@/components/share/ShareLinks';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

function ProjectSharePopup({ popupId = PopupProjectIdsConstants.ProjectSharePopup, popupData: { href } = {} }) {
  return (
    <Popup popupId={popupId} maxWidth={435} textAlign="center" headerText="Share project">
      <div className="w-100pct m-top-5 m-bottom-25">Select social network for sharing project</div>
      <ShareLinks href={href} />
    </Popup>
  );
}

export default ProjectSharePopup;
