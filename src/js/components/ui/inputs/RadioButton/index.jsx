import classNames from 'classnames';
import PropTypes from 'prop-types';

import ErrorInputMessage from '@/components/ui/inputs/_components/ErrorInputMessage';
import CheckedBlueIcon from '@/icons/project/events/CheckedBlueIcon';

import styles from './styles.module.scss';

function RadioButton({
  id,
  name,
  checked,
  onChange,
  disabled,
  label,
  children,
  invalid,
  invalidMsg,
  rounded,
  isBlue,
  className,
  buttonClassName,
  textClassName,
  okClassName,
  okCheckClassName,
}) {
  return (
    <div
      className={classNames(className, styles.radioButtonBlock, invalid && 'error', rounded && styles.radioButtonBlock_rounded)}
    >
      <label className={classNames(styles.radioButton, buttonClassName)} htmlFor={id}>
        <div className={styles.radioButton__indicator}>
          {(label || !!children) && (
            <label htmlFor={id} className={classNames(styles.radioButton__text, textClassName)}>
              {children || label}
            </label>
          )}
          <input type="radio" id={id} value={id} name={name} checked={checked} onChange={onChange} disabled={disabled} hidden />
          <span className={classNames(styles.radioButton__ok, okClassName)}>
            <span
              className={classNames(okCheckClassName, styles.radioButton__ok_check, isBlue && styles.radioButton__ok_check_blue)}
            >
              {isBlue && <CheckedBlueIcon />}
            </span>
          </span>
        </div>
        {invalid && <ErrorInputMessage invalidMessage={invalidMsg} invalid={invalid} />}
      </label>
    </div>
  );
}

RadioButton.defaultProps = {
  checked: false,
  disabled: false,
  label: '',
  invalid: false,
  invalidMsg: '',
  onChange: () => {},
  rounded: false,
  isBlue: false,
};

RadioButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  invalid: PropTypes.bool,
  invalidMsg: PropTypes.string,
  onChange: PropTypes.func,
  rounded: PropTypes.bool,
  isBlue: PropTypes.bool,
};

export default RadioButton;
