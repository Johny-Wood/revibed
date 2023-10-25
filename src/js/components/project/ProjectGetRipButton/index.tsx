import classNames from 'classnames';

import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import LightningIcon from '@/icons/project/state/LightningIcon';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

type ProjectGetRipButtonProps = {
  orderId: string | number;
  isFixed?: boolean;
};

function ProjectGetRipButton({ isFixed, orderId }: ProjectGetRipButtonProps) {
  const className = classNames(styles.projectGetRip__button);

  return (
    <div className={classNames(styles.projectGetRip, isFixed && styles.projectGetRip_fixed)}>
      <LinkRoute
        type="button"
        className={className}
        text="Get your archive copy"
        icon={LightningIcon}
        color="ripped"
        href={parseReplaceTextUtil(RoutePathsConstants.PERSONAL_PURCHASE, orderId)}
      />
    </div>
  );
}

export default ProjectGetRipButton;
