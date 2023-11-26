import { useEffect } from 'react';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import SearchIcon from '@/icons/SearchIcon';
import ScrollService from '@/services/scroll/ScrollService';

function ProjectHeaderSearchLink() {
  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)?.addSection(
      ScrollBlockIdConstants.MARKETPLACE_ID,
      RoutePathsConstants.MARKETPLACE,
      null
    );
  }, []);

  return (
    // @ts-ignore
    <ButtonIcon
      type="button_string"
      icon={SearchIcon}
      iconColor="black"
      aria-label="search"
      className="header-search-link"
      onClick={() => {
        ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
          .scrollToElement({
            sectionId: ScrollBlockIdConstants.MARKETPLACE_ID,
            secondOffset: 200,
            inRoute: false,
          })
          .then();
      }}
    />
  );
}

export default ProjectHeaderSearchLink;
