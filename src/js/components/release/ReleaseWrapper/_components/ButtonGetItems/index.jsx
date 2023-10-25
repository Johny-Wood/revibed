import RedirectComponent from '@/components/common/RedirectComponent';
import Button from '@/components/ui/buttons/Button';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { parseReplaceTextUtil } from '@/utils/textUtils';

function ButtonGetItems({ releaseId, isInProcess, onClick = () => {} }) {
  return (
    <RedirectComponent routeBefore={parseReplaceTextUtil(RoutePathsConstants.RELEASE, releaseId)}>
      <Button isInProcess={isInProcess} text="Get items" onClick={onClick} />
    </RedirectComponent>
  );
}

export default ButtonGetItems;
