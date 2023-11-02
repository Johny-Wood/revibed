import { useMemo } from 'react';

import classNames from 'classnames';

import RedirectComponent from '@/components/common/RedirectComponent';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';

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
    return <ButtonIcon isActive={isActive} text="Pre-ordered" className={classNamesEnd} {...restProps} disabled />;
  }

  return (
    <RedirectComponent
      enabled={redirectEnabled}
      routeBefore={routeBefore}
      callbackAfterRedirect={callbackAfterRedirect}
      query={query}
    >
      <ButtonIcon isActive={isActive} text={text} className={classNamesEnd} {...restProps} />
    </RedirectComponent>
  );
}

export default ProjectActionButton;
