import classNames from 'classnames';
import PropTypes from 'prop-types';

import Gem from '@/components/ui/currency/Gem';
import GoldenCoin from '@/components/ui/currency/GoldenCoin';
import LinkDefault from '@/components/ui/links/LinkDefault';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

function CreateProjectBonus({
  checked,
  error,
  type,
  className,
  iconSize,
  withDescription,
  withButton,
  bonusLinkClassName,
  bonusInfoClassName,
  linkClass,
  children,
}) {
  const { isNotDesktop } = ViewportHook();

  return (
    <span
      className={classNames([
        styles.createProjectBonus,
        type === 'GEM' && styles.createProjectBonus_GEM,
        type === 'GOLDEN_COIN' && styles.createProjectBonus_GOLDEN_COIN,
        checked && styles.createProjectBonus_checked,
        error && styles.createProjectBonus_error,
        className,
      ])}
    >
      {type === 'GEM' && <Gem size={iconSize} />}
      {type === 'GOLDEN_COIN' && <GoldenCoin size={iconSize} />}
      <span className={classNames(styles.createProjectBonus__info, bonusInfoClassName)}>
        <span className={styles.createProjectBonus__title}>
          <b>You have a{type === 'GEM' ? 'gem' : ' Golden Koin'}!</b>
        </span>
        <span className={classNames(styles.createProjectBonus__link, bonusLinkClassName)}>
          {withDescription && (
            <span>
              Now you can start project for free
              <span className="point">.&nbsp;</span>
            </span>
          )}
          <LinkDefault className={linkClass} text="View details" href={RoutePathsConstants[`${type}_DETAILS`]} />
        </span>
      </span>
      {withButton && (
        <LinkRoute
          type="button"
          text={`Wanted${!isNotDesktop ? ' projects' : ''}`}
          href={RoutePathsConstants.WANTED}
          size="small-45"
        />
      )}
      {children}
    </span>
  );
}

CreateProjectBonus.defaultProps = {
  iconSize: 47,
  withButton: true,
  withDescription: true,
  linkClass: 'c-gray-2 underline',
  className: '',
};

CreateProjectBonus.propTypes = {
  iconSize: PropTypes.number,
  withButton: PropTypes.bool,
  withDescription: PropTypes.bool,
  linkClass: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(['GEM', 'GOLDEN_COIN']).isRequired,
};

export default CreateProjectBonus;
