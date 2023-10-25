import classNames from 'classnames';
import PropTypes from 'prop-types';

import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import ComponentsCommonConstants from '@/constants/components/common';
import ArrowIcon from '@/icons/arrows/ArrowIcon';
import CheckboxBigOkIcon from '@/icons/CheckboxBigOkIcon';
import CheckboxOkIcon from '@/icons/CheckboxOkIcon';

import styles from './styles.module.scss';

const renderCheckBoxOk = ({ rounded, dark }) => {
  if (dark) {
    return <CheckboxOkIcon />;
  }

  if (rounded) {
    return <CheckboxBigOkIcon />;
  }

  return <ArrowIcon size={ComponentsCommonConstants.Size.SMALL} />;
};

const renderOk = ({ checked, changed, rounded, dark }) => (
  <span className={classNames('checkbox__ok', styles.checkbox__ok)}>
    <TransitionSwitchLayout isShown={checked}>{renderCheckBoxOk({ rounded, dark })}</TransitionSwitchLayout>
    {changed && <span className={classNames('checkbox__changed', styles.checkbox__changed)} />}
  </span>
);

function CheckBox({
  id,
  checked,
  onChange,
  disabled,
  label,
  children,
  invalid,
  invalidMsg,
  rounded,
  className = '',
  textClass = '',
  borderRadius,
  dark,
  changed,
  wrapperContent: WrapperContent,
  wrapperContentProps,
}) {
  return (
    <div
      className={classNames(
        className,
        'u-select_none',
        invalid && 'error',
        styles.checkboxBlock,
        'checkbox-block',
        rounded && 'checkbox-block--rounded',
        rounded && styles.checkboxBlock_rounded,
        disabled && 'disabled',
        disabled && styles.checkboxBlock_disabled,
        borderRadius && 'with-border-radius',
        borderRadius && styles.checkboxBlock_withBorderRadius,
        checked && 'checked',
        checked && styles.checkboxBlock_checked,
        dark && 'dark',
        dark && styles.checkboxBlock_dark,
        changed && 'changed'
      )}
    >
      <label className={classNames('checkbox', styles.checkbox)} htmlFor={id}>
        <span className={classNames('checkbox__indicator', styles.checkbox__indicator)}>
          {(children || label) && (
            <span className={classNames('checkbox__text', styles.checkbox__text, textClass)}>{children || label}</span>
          )}
          <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e)} disabled={disabled} hidden />
          {WrapperContent ? (
            <WrapperContent {...wrapperContentProps}>{renderOk({ checked, changed, rounded, dark })}</WrapperContent>
          ) : (
            renderOk({ checked, changed, rounded, dark })
          )}
        </span>
      </label>
      <ErrorInputMessage invalidMessage={invalidMsg} invalid={invalid} />
    </div>
  );
}

CheckBox.defaultProps = {
  checked: false,
  changed: false,
  disabled: false,
  label: '',
  invalid: false,
  invalidMsg: '',
  textClass: '',
  className: '',
  onChange: () => {},
  rounded: false,
  borderRadius: false,
  dark: false,
  wrapperContentProps: {},
};

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  changed: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  invalid: PropTypes.bool,
  invalidMsg: PropTypes.string,
  onChange: PropTypes.func,
  rounded: PropTypes.bool,
  textClass: PropTypes.string,
  className: PropTypes.string,
  borderRadius: PropTypes.bool,
  dark: PropTypes.bool,
  wrapperContentProps: PropTypes.object,
};

export default CheckBox;
