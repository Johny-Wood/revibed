import parse from 'html-react-parser';

import LinkDefault from '@/components/ui/links/LinkDefault';
import { RoutePathsConstants } from '@/constants/routes/routes';

function TagTooltipContent({ text, hoveredStatus }) {
  return (
    <span>
      {parse(text)}
      .&nbsp;
      <LinkDefault
        className="c-blue"
        text="See more"
        href={`${RoutePathsConstants.FAQ}/what-do-the-different-project-statuses-mean/#${hoveredStatus
          .toLowerCase()
          .replace(/_/gi, '-')}`}
      />
    </span>
  );
}

export default TagTooltipContent;
