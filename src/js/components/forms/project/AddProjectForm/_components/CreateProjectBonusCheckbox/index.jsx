import classNames from 'classnames';
import PropTypes from 'prop-types';

import CreateProjectBonus from '@/components/forms/project/AddProjectForm/_components/CreateProjectBonus';
import CheckBox from '@/components/ui/inputs/CheckBox';

import styles from './styles.module.scss';

function CreateProjectBonusCheckbox({ id, type, text, withDescription, iconSize, disabled, checked, error, onChange }) {
  return (
    <div className={styles.createProjectBonusCheckboxWrapper}>
      <CheckBox
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        dark
        wrapperContent={CreateProjectBonus}
        wrapperContentProps={{
          type,
          className: classNames(
            styles.createProjectBonusCheckbox,
            'create-project-bonus-checkbox',
            `create-project-bonus-checkbox_${type}`
          ),
          checked,
          error,
          bonusLinkClassName: styles.createProjectBonus__link,
          bonusInfoClassName: styles.createProjectBonus__info,
          iconSize,
          text,
          withDescription,
          withButton: false,
        }}
      />
    </div>
  );
}

CreateProjectBonusCheckbox.defaultProps = {
  error: false,
  disabled: false,
  iconSize: 37,
  onChange: () => {},
};

CreateProjectBonusCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['GEM', 'GOLDEN_COIN']).isRequired,
  disabled: PropTypes.bool,
  iconSize: PropTypes.number,
  error: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CreateProjectBonusCheckbox;
