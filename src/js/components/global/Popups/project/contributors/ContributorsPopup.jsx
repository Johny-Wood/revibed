import Popup from '@/components/primary/Popup';
import Contributor from '@/components/project/_components/Contributor';
import { PopupProjectIdsConstants } from '@/constants/popups/id';

import styles from './styles.module.scss';

function ContributorsPopup({
  popupId = PopupProjectIdsConstants.ContributorsPopup,
  popupData: { contributors = [] } = {},

  closePopup,
}) {
  return (
    <Popup popupId={popupId} headerText="People who wanted this project" maxWidth={400} classCustom={styles.ContributorsPopup}>
      {contributors.map((contributor) => {
        const { id } = contributor;

        return (
          <Contributor
            className={styles.contributor}
            key={`contributor-${id}`}
            contributor={contributor}
            isRoute
            onClick={() => {
              closePopup(popupId);
            }}
          />
        );
      })}
    </Popup>
  );
}

export default ContributorsPopup;
