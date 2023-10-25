import { useMemo } from 'react';

import classNames from 'classnames';

import RedirectComponent from '@/components/common/RedirectComponent';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import PlusThreeColorIcon from '@/icons/project/PlusThreeColorIcon';

import styles from './styles.module.scss';

function ProjectActionButton({
  withIcon,
  text,
  title,
  participationContributor,
  isUseGoldenCoinVisible,
  isUseGoldenCoin,
  isUseGem,
  isActive,
  redirectEnabled,
  routeBefore,
  callbackAfterRedirect,
  query,
  type,

  className,

  ...restProps
}) {
  const classNamesEnd = useMemo(
    () =>
      classNames([
        'project-action-button',
        participationContributor && type === 'BUY_CUT' && 'project-action-button_more',
        (isUseGem || isUseGoldenCoin || isUseGoldenCoinVisible) &&
          `project-action-button_${isUseGoldenCoin || isUseGoldenCoinVisible ? 'with_golden_coin' : 'with_gems'}`,
        className,
      ]),
    [participationContributor, type, isUseGem, isUseGoldenCoin, isUseGoldenCoinVisible, className]
  );

  if (participationContributor) {
    return (
      <div className={classNames('project-action-button project-action-button_in button-buy-cut', styles.ProjectActionButton_in)}>
        <span className={classNames('text', styles.ProjectActionButton_in__text)}>You&rsquo;re in</span>
      </div>
    );
  }

  return (
    <RedirectComponent
      enabled={redirectEnabled}
      routeBefore={routeBefore}
      callbackAfterRedirect={callbackAfterRedirect}
      query={query}
    >
      <ButtonIcon
        isActive={isActive}
        text={text}
        className={classNamesEnd}
        icon={withIcon ? PlusThreeColorIcon : undefined}
        {...restProps}
      />
    </RedirectComponent>
  );
}

export default ProjectActionButton;
